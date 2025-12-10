// docusignClient.js (CommonJS)

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const docusign = require('docusign-esign');

function getOAuthHost() {
  const env = (process.env.DOCUSIGN_ENV || 'demo').toLowerCase();
  return env === 'prod' ? 'account.docusign.com' : 'account-d.docusign.com';
}

/**
 * Load a PEM from disk.
 * Accepts PKCS#8 ("-----BEGIN PRIVATE KEY-----") or PKCS#1 ("-----BEGIN RSA PRIVATE KEY-----").
 * If PKCS#1, converts to PKCS#8 using Node's crypto in-memory.
 */
function loadPrivateKeyPemFromFs() {
  const keyPath = process.env.DOCUSIGN_PRIVATE_KEY_PATH;
  if (!keyPath) {
    throw new Error('Missing env: DOCUSIGN_PRIVATE_KEY_PATH (path to your PEM file)');
  }

  const abs = path.isAbsolute(keyPath) ? keyPath : path.join(process.cwd(), keyPath);
  if (!fs.existsSync(abs)) {
    throw new Error(`Private key file not found at: ${abs}`);
  }

  // Normalize CRLF to LF to avoid weird header detection issues
  const raw = fs.readFileSync(abs, 'utf8').replace(/\r\n/g, '\n').trim();

  const first = raw.split('\n')[0]?.trim();
  if (first === '-----BEGIN PRIVATE KEY-----') {
    // PKCS#8 already
    return raw;
  }

  if (first === '-----BEGIN RSA PRIVATE KEY-----') {
    // PKCS#1 → import & export as PKCS#8
    const keyObject = crypto.createPrivateKey({
      key: raw,
      format: 'pem',
      type: 'pkcs1',
    });
    const pkcs8 = keyObject.export({ type: 'pkcs8', format: 'pem' });
    return pkcs8.toString();
  }

  throw new Error(
    `Unrecognized private key header "${first}". Expected "-----BEGIN PRIVATE KEY-----" (PKCS#8) or "-----BEGIN RSA PRIVATE KEY-----" (PKCS#1).`
  );
}

/** Build a JWT and exchange it for an access token (robust attempts) */
async function getAccessTokenManualJWT({ integratorKey, userId, privateKeyPem }) {
  const { SignJWT, importPKCS8 } = await import('jose');
  const alg = 'RS256';
  const host = getOAuthHost(); // e.g., account-d.docusign.com

  const key = await importPKCS8(privateKeyPem, alg);

  // Try variations for aud and scope to satisfy stricter tenants
  const attempts = [
    { aud: host,            scope: false },
    { aud: `https://${host}`, scope: false },
    { aud: host,            scope: true  },
    { aud: `https://${host}`, scope: true  },
  ];

  let lastErr;

  for (const a of attempts) {
    try {
      const jwt = await new SignJWT({})
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setNotBefore('-2 minutes')
        .setExpirationTime('1h')
        .setIssuer(integratorKey)  // iss
        .setSubject(userId)        // sub
        .setAudience(a.aud)        // aud (host or https://host)
        .sign(key);

      const body = new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      });
      if (a.scope) body.set('scope', 'signature impersonation');

      const resp = await fetch(`https://${host}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (!resp.ok) {
        lastErr = new Error(`OAuth token failed: ${resp.status} ${await resp.text()}`);
        continue;
      }
      const data = await resp.json();
      return data.access_token;
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error('OAuth token failed');
}

/** JWT login + discover REST base; returns { apiClient, accountId } */
async function getDocusignContext() {
  const apiClient = new docusign.ApiClient();
  const oauthHost = getOAuthHost();

  if (typeof apiClient.setOAuthBasePath === 'function') {
    apiClient.setOAuthBasePath(oauthHost);
  } else {
    apiClient.oAuthBasePath = oauthHost;
  }

  const integratorKey = (process.env.DOCUSIGN_INTEGRATION_KEY || '').trim();
  const userId = (process.env.DOCUSIGN_IMPERSONATED_USER_GUID || '').trim();
  if (integratorKey.length !== 36) throw new Error('DOCUSIGN_INTEGRATION_KEY must be a 36-char GUID');
  if (userId.length !== 36) throw new Error('DOCUSIGN_IMPERSONATED_USER_GUID must be a 36-char GUID');

  const privateKeyPem = loadPrivateKeyPemFromFs();

  const accessToken = await getAccessTokenManualJWT({ integratorKey, userId, privateKeyPem });
  if (!accessToken) throw new Error('DocuSign JWT failed: no access_token');

  const userInfo = await apiClient.getUserInfo(accessToken);
  const acct =
    (userInfo.accounts || []).find(a => a.isDefault === true || a.isDefault === 'true') ||
    (userInfo.accounts || [])[0];
  if (!acct) throw new Error('No DocuSign account found for this user');

  apiClient.setBasePath(`${acct.baseUri}/restapi`);
  apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);

  return { apiClient, accountId: acct.accountId };
}

/** Build envelope (unchanged from your version) */
function buildEnvelopeDefinition({
  fileBase64,
  fileName = 'Contract.pdf',
  signerEmail,
  signerName,
  emailSubject = 'Please sign the contract',
  anchors = [],
  boxes = [],
  embedded = false,
  clientUserId
}) {
  const signHereTabs = [];

  for (const a of anchors) {
    signHereTabs.push(
      new docusign.SignHere({
        anchorString: a.anchorString,
        anchorUnits: 'pixels',
        anchorXOffset: String(a.offsetX ?? 0),
        anchorYOffset: String(a.offsetY ?? 0),
        ...(a.pageNumber ? { pageNumber: String(a.pageNumber) } : {})
      })
    );
  }

  for (const b of boxes) {
    signHereTabs.push(
      new docusign.SignHere({
        documentId: '1',
        pageNumber: String(b.pageNumber),
        xPosition: String(b.x),
        yPosition: String(b.y)
      })
    );
  }

  const signer = new docusign.Signer({
    email: signerEmail,
    name: signerName,
    recipientId: '1',
    routingOrder: '1',
    ...(embedded && clientUserId ? { clientUserId } : {}),
    tabs: signHereTabs.length ? new docusign.Tabs({ signHereTabs }) : undefined
  });

  const document = new docusign.Document({
    documentBase64: fileBase64,
    name: fileName,
    fileExtension: 'pdf',
    documentId: '1'
  });

  return new docusign.EnvelopeDefinition({
    emailSubject,
    status: 'sent',
    documents: [document],
    recipients: new docusign.Recipients({ signers: [signer] })
  });
}

async function createEnvelope(envelopeDefinition) {
  const { apiClient, accountId } = await getDocusignContext();
  const envelopesApi = new docusign.EnvelopesApi(apiClient);
  const res = await envelopesApi.createEnvelope({ accountId, envelopeDefinition });
  return { envelopeId: res.envelopeId, accountId };
}

async function createRecipientView({ envelopeId, returnUrl, signerEmail, signerName, clientUserId }) {
  const { apiClient, accountId } = await getDocusignContext();
  const envelopesApi = new docusign.EnvelopesApi(apiClient);
  const viewReq = new docusign.RecipientViewRequest({
    returnUrl,
    authenticationMethod: 'none',
    email: signerEmail,
    userName: signerName,
    clientUserId
  });
  const view = await envelopesApi.createRecipientView({
    accountId,
    envelopeId,
    recipientViewRequest: viewReq
  });
  return { url: view.url };
}

module.exports = {
  buildEnvelopeDefinition,
  createEnvelope,
  createRecipientView,
};
