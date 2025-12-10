// /docusign/docusignClient.js
const docusign = require('docusign-esign');
const fs = require('fs');
const path = require('path');

let cache = { token: null, exp: 0 };
const now = () => Date.now();

// Read the private key from env (B64) OR from a file next to package.json (private.key)
// Do NOT force PKCS#8 here — behave like your Express code.
function loadPrivateKeyBuffer() {
  if (process.env.DOCUSIGN_PRIVATE_KEY_B64) {
    return Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY_B64, 'base64');
  }
  const keyPath = path.resolve(process.cwd(), 'private.key'); // same as your Express __dirname + 'private.key'
  if (!fs.existsSync(keyPath)) {
    throw new Error(`DocuSign private key not found at ${keyPath} (or set DOCUSIGN_PRIVATE_KEY_B64).`);
  }
  // Return raw bytes (PEM). DocuSign SDK will error if it’s truly invalid.
  return Buffer.from(fs.readFileSync(keyPath, 'utf8'), 'utf8');
}

function env(name, fallbackName) {
  return process.env[name] || (fallbackName ? process.env[fallbackName] : undefined);
}

async function getAccessToken() {
  if (cache.token && now() < cache.exp) return cache.token;

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(env('DOCUSIGN_BASE_PATH', 'BASE_PATH')); // fallback to BASE_PATH like your Express code

  const jwt = await apiClient.requestJWTUserToken(
    env('DOCUSIGN_INTEGRATION_KEY', 'INTEGRATION_KEY'),
    env('DOCUSIGN_USER_ID', 'USER_ID'),
    ['signature'],
    loadPrivateKeyBuffer(),
    3600
  );

  cache.token = jwt.body.access_token;
  cache.exp = now() + (jwt.body.expires_in - 60) * 1000;
  return cache.token;
}

async function getEnvelopesApi() {
  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(env('DOCUSIGN_BASE_PATH', 'BASE_PATH'));
  const token = await getAccessToken();
  apiClient.addDefaultHeader('Authorization', `Bearer ${token}`);
  return new docusign.EnvelopesApi(apiClient);
}

function makeEnvelope({ name, email, company }) {
  const envDef = new docusign.EnvelopeDefinition();
  envDef.templateId = env('DOCUSIGN_TEMPLATE_ID', 'TEMPLATE_ID');
  envDef.emailSubject = 'Please sign your application';

  const textTab = docusign.Text.constructFromObject({
    tabLabel: 'company_name', // ensure this matches your template
    value: company || '',
  });

  const tabs = docusign.Tabs.constructFromObject({ textTabs: [textTab] });

  const signer = docusign.TemplateRole.constructFromObject({
    email,
    name,
    roleName: 'Applicant', // must match template role
    tabs,
  });

  envDef.templateRoles = [signer];
  envDef.status = 'sent';
  return envDef;
}

async function sendEnvelope({ name, email, company }) {
  const api = await getEnvelopesApi();
  const envDef = makeEnvelope({ name, email, company });
  const accountId = env('DOCUSIGN_ACCOUNT_ID', 'ACCOUNT_ID');
  const res = await api.createEnvelope(accountId, { envelopeDefinition: envDef });
  return { envelopeId: res.envelopeId };
}

module.exports = { sendEnvelope };
