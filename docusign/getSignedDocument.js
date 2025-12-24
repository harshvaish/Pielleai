// Minimal helper module to download the combined signed PDF for a DocuSign envelope.
// This file is intentionally standalone so the original docusign client remains unchanged.

require('server-only');

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function base64Url(input) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input));
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function env(name, fallback) {
  return process.env[name] || (fallback ? process.env[fallback] : undefined);
}

function loadPrivateKeyPem() {
  const keyPath = path.resolve(process.cwd(), 'private.key');

  if (!fs.existsSync(keyPath)) {
    throw new Error(`DocuSign private key not found at ${keyPath}. Add private.key locally or use env in production.`);
  }

  const pem = fs.readFileSync(keyPath, 'utf8').trim();
  const keyObj = crypto.createPrivateKey(pem);

  if (keyObj.asymmetricKeyType !== 'rsa') {
    throw new Error(`private.key must be RSA (got: ${keyObj.asymmetricKeyType})`);
  }

  return { pem, keyObj };
}

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
    aud: authServer,
    iat,
    exp,
    scope: 'signature impersonation',
  };

  const signingInput = `${base64Url(JSON.stringify(header))}.${base64Url(JSON.stringify(payload))}`;
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

let cache = {
  accessToken: null,
  expMs: 0,
  baseUri: null,
  accountId: null,
  loggedOnce: false,
};

const nowMs = () => Date.now();

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
  cache.baseUri = picked.base_uri;
  cache.accountId = String(picked.account_id);
  cache.expMs = nowMs() + (expiresInSec - 60) * 1000;

  if (!cache.loggedOnce) {
    cache.loggedOnce = true;
    console.log('[DocuSign:getSignedDocument] baseUri:', cache.baseUri, 'accountId:', cache.accountId);
  }

  return cache;
}

/**
 * Download the combined signed PDF for an envelope
 * @param {string} envelopeId
 * @returns {Promise<Buffer>} PDF buffer
 */
async function getSignedDocument(envelopeId) {
  if (!envelopeId) throw new Error('Missing envelopeId');

  const { accessToken, baseUri, accountId } = await getAuthContext();

  const res = await fetch(`${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}/documents/combined`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(`DocuSign getSignedDocument error (${res.status}): ${txt}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Return envelope details (status, etc.)
 * @param {string} envelopeId
 * @returns {Promise<Object>} envelope JSON
 */
async function getEnvelopeStatus(envelopeId) {
  if (!envelopeId) throw new Error('Missing envelopeId');

  const { accessToken, baseUri, accountId } = await getAuthContext();

  const res = await fetch(`${baseUri}/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg = json?.message || JSON.stringify(json) || res.statusText;
    throw new Error(`DocuSign getEnvelopeStatus error (${res.status}): ${msg}`);
  }

  return json;
}

module.exports = {
  getSignedDocument,
  getEnvelopeStatus,
};