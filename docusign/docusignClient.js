// /docusign/docusignClient.js
const docusign = require("docusign-esign");
const fs = require("fs");
const path = require("path");

let cache = {
  token: null,
  exp: 0,
  baseUri: null,
  loggedOnce: false,
};

const now = () => Date.now();
const env = (name, fallback) => process.env[name] || (fallback ? process.env[fallback] : undefined);

/** Load private key from env (B64) or from project root: ./private.key */
function loadPrivateKeyBuffer() {
  if (process.env.DOCUSIGN_PRIVATE_KEY_B64) {
    return Buffer.from(process.env.DOCUSIGN_PRIVATE_KEY_B64, "base64");
  }
  const keyPath = path.resolve(process.cwd(), "private.key");
  if (!fs.existsSync(keyPath)) {
    throw new Error(
      `DocuSign private key not found. Expected at ${keyPath} or set DOCUSIGN_PRIVATE_KEY_B64.`
    );
  }
  return Buffer.from(fs.readFileSync(keyPath, "utf8"), "utf8");
}

/** Get JWT access token and discover correct account baseUri (naX/euX/etc) */
async function getAccessTokenAndBaseUri() {
  if (cache.token && now() < cache.exp && cache.baseUri) {
    return { accessToken: cache.token, baseUri: cache.baseUri };
  }

  const oauthClient = new docusign.ApiClient();
  oauthClient.setBasePath(env("DOCUSIGN_BASE_PATH", "BASE_PATH") || "https://demo.docusign.net/restapi");

  const jwt = await oauthClient.requestJWTUserToken(
    env("DOCUSIGN_INTEGRATION_KEY", "INTEGRATION_KEY"),
    env("DOCUSIGN_USER_ID", "USER_ID"),
    ["signature"],
    loadPrivateKeyBuffer(),
    3600
  );

  const accessToken = jwt.body.access_token;

  // Discover account baseUri for REST calls
  const userInfo = await oauthClient.getUserInfo(accessToken);
  const accounts = Array.isArray(userInfo.accounts) ? userInfo.accounts : [];
  const pickDefault =
    accounts.find(a => a.isDefault === "true" || a.isDefault === true) || accounts[0];

  if (!pickDefault || !pickDefault.baseUri) {
    throw new Error("Unable to resolve DocuSign account baseUri from getUserInfo().");
  }
  const baseUri = pickDefault.baseUri; // e.g., https://na3.docusign.net

  cache.token = accessToken;
  cache.baseUri = baseUri;
  cache.exp = now() + (jwt.body.expires_in - 60) * 1000;

  return { accessToken, baseUri };
}

/** Build an EnvelopesApi client with proper Authorization + baseUri */
async function getEnvelopesApi() {
  const { accessToken, baseUri } = await getAccessTokenAndBaseUri();

  const apiClient = new docusign.ApiClient();
  apiClient.setBasePath(`${baseUri}/restapi`);
  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  if (!cache.loggedOnce) {
    cache.loggedOnce = true;
    console.log("[DocuSign] Using baseUri:", `${baseUri}/restapi`);
  }

  return new docusign.EnvelopesApi(apiClient);
}

/* ===================== TEMPLATE-BASED SENDING ===================== */

function makeEnvelope({ name, email, company }) {
  const envDef = new docusign.EnvelopeDefinition();
  envDef.templateId = env("DOCUSIGN_TEMPLATE_ID", "TEMPLATE_ID");
  envDef.emailSubject = "Please sign your application";

  const textTab = docusign.Text.constructFromObject({
    tabLabel: "company_name", // must match your template tab label
    value: company || "",
  });
  const tabs = docusign.Tabs.constructFromObject({ textTabs: [textTab] });

  const signer = docusign.TemplateRole.constructFromObject({
    email,
    name,
    roleName: "Applicant", // must match your template role
    tabs,
    // Do NOT set clientUserId for remote signing
  });

  envDef.templateRoles = [signer];
  envDef.status = "sent"; // send immediately
  return envDef;
}

async function sendEnvelope({ name, email, company }) {
  const envelopesApi = await getEnvelopesApi();
  const envDef = makeEnvelope({ name, email, company });
  const accountId = env("DOCUSIGN_ACCOUNT_ID", "ACCOUNT_ID");
  const res = await envelopesApi.createEnvelope(accountId, { envelopeDefinition: envDef });
  return { envelopeId: res.envelopeId };
}

/* ===================== RAW PDF UPLOAD SENDING ===================== */

function makeSignHere({ documentId = "1", pageNumber = 1, x = 450, y = 650, anchorString }) {
  if (anchorString) {
    // Anchor-based placement (put {{SIGN_HERE}} or similar in the PDF text)
    return docusign.SignHere.constructFromObject({
      anchorString,
      anchorUnits: "pixels",
      anchorXOffset: "0",
      anchorYOffset: "0",
    });
  }
  // Absolute placement (pixels) on a specific page
  return docusign.SignHere.constructFromObject({
    documentId,
    pageNumber: String(pageNumber),
    xPosition: String(x),
    yPosition: String(y),
  });
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
  fileName = "document.pdf",
  signer = { name: "", email: "" },
  placement = { pageNumber: 1, x: 450, y: 650 },
}) {
  const envelopesApi = await getEnvelopesApi();

  const document = new docusign.Document();
  document.documentBase64 = pdfBuffer.toString("base64");
  document.name = fileName;
  document.fileExtension = "pdf";
  document.documentId = "1";

  const signHere = makeSignHere({ documentId: "1", ...placement });
  const tabs = docusign.Tabs.constructFromObject({ signHereTabs: [signHere] });

  const signerRole = new docusign.Signer();
  signerRole.email = signer.email;
  signerRole.name = signer.name;
  signerRole.recipientId = "1";
  signerRole.routingOrder = "1";
  signerRole.tabs = tabs;

  const recipients = new docusign.Recipients();
  recipients.signers = [signerRole];

  const envDef = new docusign.EnvelopeDefinition();
  envDef.emailSubject = "Please sign this document";
  envDef.documents = [document];
  envDef.recipients = recipients;
  envDef.status = "sent";

  const accountId = env("DOCUSIGN_ACCOUNT_ID", "ACCOUNT_ID");
  const result = await envelopesApi.createEnvelope(accountId, { envelopeDefinition: envDef });
  return { envelopeId: result.envelopeId };
}

module.exports = {
  sendEnvelope,        // template-based
  sendPdfForSignature, // raw PDF upload
};
