// /docusign/docusignClient.js
require('server-only');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

let cache = {
  accessToken: null,
  expMs: 0,
  baseUri: null,
  accountId: null,
  loggedOnce: false,
};

const nowMs = () => Date.now();

function env(name, fallback) {
  return process.env[name] || (fallback ? process.env[fallback] : undefined);
}

function base64Url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input));
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Load RSA private key from ./private.key (project root)
 * Works locally. On Vercel you generally should use env instead of a file.
 */
function loadPrivateKeyPem() {
  const keyPath = path.resolve(process.cwd(), 'private.key');

  if (!fs.existsSync(keyPath)) {
    throw new Error(
      `DocuSign private key not found at ${keyPath}. Add private.key locally or use env in production.`,
    );
  }

  const pem = fs.readFileSync(keyPath, 'utf8').trim();
  const keyObj = crypto.createPrivateKey(pem);

  if (keyObj.asymmetricKeyType !== 'rsa') {
    throw new Error(`private.key must be RSA (got: ${keyObj.asymmetricKeyType})`);
  }

  return { pem, keyObj };
}

/**
 * Build JWT assertion for DocuSign JWT Grant (Demo)
 * IMPORTANT: aud must be hostname only (no https://)
 */
function buildJwtAssertion() {
  const integrationKey = env('DOCUSIGN_INTEGRATION_KEY', 'INTEGRATION_KEY');
  const userId = env('DOCUSIGN_USER_ID', 'USER_ID');
  const authServer = env('DOCUSIGN_AUTH_SERVER') || 'account-d.docusign.com';

  if (!integrationKey) throw new Error('Missing DOCUSIGN_INTEGRATION_KEY');
  if (!userId) throw new Error('Missing DOCUSIGN_USER_ID');

  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 3600;

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: integrationKey,
    sub: userId,
    aud: authServer, // ✅ hostname only
    iat,
    exp,
    scope: 'signature impersonation',
    // If you still get 400 no_valid_keys_or_signatures, try:
    // scope: 'signature',
  };

  const signingInput = `${base64Url(JSON.stringify(header))}.${base64Url(
    JSON.stringify(payload),
  )}`;

  const { keyObj } = loadPrivateKeyPem();

  const signature = crypto.sign('sha256', Buffer.from(signingInput), {
    key: keyObj,
    padding: crypto.constants.RSA_PKCS1_PADDING,
  });

  return `${signingInput}.${base64Url(signature)}`;
}

async function fetchAccessToken() {
  const authServer = env('DOCUSIGN_AUTH_SERVER') || 'account-d.docusign.com';
  const assertion = buildJwtAssertion();

  const body = new URLSearchParams();
  body.set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  body.set('assertion', assertion);

  const res = await fetch(`https://${authServer}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.error_description || json?.error || res.statusText;
    throw new Error(`DocuSign token error (${res.status}): ${msg}`);
  }

  return json; // { access_token, expires_in, token_type }
}

async function fetchUserInfo(accessToken) {
  const authServer = env('DOCUSIGN_AUTH_SERVER') || 'account-d.docusign.com';

  const res = await fetch(`https://${authServer}/oauth/userinfo`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.message || res.statusText;
    throw new Error(`DocuSign userinfo error (${res.status}): ${msg}`);
  }

  return json;
}

async function getAuthContext() {
  if (
    cache.accessToken &&
    nowMs() < cache.expMs &&
    cache.baseUri &&
    cache.accountId
  ) {
    return cache;
  }

  const token = await fetchAccessToken();
  const accessToken = token.access_token;
  const expiresInSec = Number(token.expires_in || 3600);

  const userInfo = await fetchUserInfo(accessToken);
  const accounts = Array.isArray(userInfo.accounts) ? userInfo.accounts : [];

  const preferredAccountId = env('DOCUSIGN_ACCOUNT_ID', 'ACCOUNT_ID');

  const picked =
    (preferredAccountId &&
      accounts.find((a) => String(a.account_id) === String(preferredAccountId))) ||
    accounts.find((a) => a.is_default === true || a.is_default === 'true') ||
    accounts[0];

  if (!picked?.base_uri || !picked?.account_id) {
    throw new Error('Unable to resolve DocuSign base_uri/account_id from userinfo.');
  }

  cache.accessToken = accessToken;
  cache.baseUri = picked.base_uri; // e.g. https://na3.docusign.net
  cache.accountId = String(picked.account_id);
  cache.expMs = nowMs() + (expiresInSec - 60) * 1000;

  if (!cache.loggedOnce) {
    cache.loggedOnce = true;
    console.log('[DocuSign] baseUri:', cache.baseUri, 'accountId:', cache.accountId);
  }

  return cache;
}

/**
 * Send a one-off PDF for signature (remote signing via email)
 * @param {Object} opts
 * @param {Buffer} opts.pdfBuffer
 * @param {string} [opts.fileName='document.pdf']
 * @param {{name:string,email:string}} opts.signer
 * @param {{pageNumber?:number,x?:number,y?:number,anchorString?:string}} [opts.placement]
 */
async function sendPdfForSignature({
  pdfBuffer,
  fileName = 'document.pdf',
  signer = { name: '', email: '' },
  placement = { pageNumber: 1, x: 450, y: 650 },
}) {
  const { accessToken, baseUri, accountId } = await getAuthContext();

  if (!signer?.name || !signer?.email) {
    throw new Error('Missing signer name/email');
  }

  const documentBase64 = Buffer.from(pdfBuffer).toString('base64');

  const signHereTab = placement?.anchorString
    ? {
        anchorString: placement.anchorString,
        anchorUnits: 'pixels',
        anchorXOffset: '0',
        anchorYOffset: '0',
      }
    : {
        documentId: '1',
        pageNumber: String(placement?.pageNumber ?? 1),
        xPosition: String(placement?.x ?? 450),
        yPosition: String(placement?.y ?? 650),
      };

  const envelopeDefinition = {
    emailSubject: 'Please sign this document',
    status: 'sent',
    documents: [
      {
        documentBase64,
        name: fileName,
        fileExtension: 'pdf',
        documentId: '1',
      },
    ],
    recipients: {
      signers: [
        {
          email: signer.email,
          name: signer.name,
          recipientId: '1',
          routingOrder: '1',
          tabs: { signHereTabs: [signHereTab] },
        },
      ],
    },
  };

  const res = await fetch(`${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(envelopeDefinition),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.message || JSON.stringify(json) || res.statusText;
    throw new Error(`DocuSign createEnvelope error (${res.status}): ${msg}`);
  }

  if (!json?.envelopeId) {
    throw new Error('DocuSign createEnvelope did not return envelopeId');
  }

  return { envelopeId: json.envelopeId };
}

module.exports = {
  sendPdfForSignature,
};
