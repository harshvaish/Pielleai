// print-public.js
const { createPrivateKey, createPublicKey } = require('crypto');

const b64 = process.env.DOCUSIGN_PRIVATE_KEY_B64;
if (!b64) throw new Error('Missing env DOCUSIGN_PRIVATE_KEY_B64');

const pem = Buffer.from(b64, 'base64').toString('utf8').trim();
if (!pem.includes('BEGIN PRIVATE KEY')) throw new Error('Expected PKCS#8 (BEGIN PRIVATE KEY)');

const priv = createPrivateKey({ key: pem, format: 'pem' });
const pubPem = createPublicKey(priv).export({ type: 'spki', format: 'pem' }).toString();

console.log(pubPem);
