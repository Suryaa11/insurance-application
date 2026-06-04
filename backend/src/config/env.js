const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

function collectEnvCandidates() {
  const candidates = [];

  if (process.env.ENV_FILE) {
    candidates.push(path.resolve(process.env.ENV_FILE));
  }

  candidates.push(
    path.resolve(process.cwd(), 'backend/.env'),
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../backend/.env'),
    path.resolve(__dirname, '../../.env')
  );

  return [...new Set(candidates)];
}

const loadedEnv = {};

for (const envPath of collectEnvCandidates()) {
  if (fs.existsSync(envPath)) {
    Object.assign(loadedEnv, dotenv.parse(fs.readFileSync(envPath)));
  }
}

for (const [key, value] of Object.entries(loadedEnv)) {
  if ((process.env[key] === undefined || process.env[key] === '') && value !== undefined && value !== '') {
    process.env[key] = value;
  }
}

const resolvedAzureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const resolvedAzureContainerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'insurance-documents';
const resolvedAzureAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const resolvedAzureAccountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || '';

const effectiveAzureConnectionString = resolvedAzureConnectionString || (
  resolvedAzureAccountName && resolvedAzureAccountKey
    ? `DefaultEndpointsProtocol=https;AccountName=${resolvedAzureAccountName};AccountKey=${resolvedAzureAccountKey};EndpointSuffix=core.windows.net`
    : ''
);

if (effectiveAzureConnectionString) {
  process.env.AZURE_STORAGE_CONNECTION_STRING = effectiveAzureConnectionString;
}
if (resolvedAzureContainerName) {
  process.env.AZURE_STORAGE_CONTAINER_NAME = resolvedAzureContainerName;
}

const required = ['MONGODB_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  logLevel: process.env.LOG_LEVEL || 'info',
  azureStorageConnectionString: effectiveAzureConnectionString,
  azureStorageContainerName: resolvedAzureContainerName
};
