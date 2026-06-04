const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envCandidates = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(__dirname, '../../backend/.env'),
  process.env.ENV_FILE && path.resolve(process.env.ENV_FILE)
].filter(Boolean);

const loadedEnv = {};

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    Object.assign(loadedEnv, dotenv.parse(fs.readFileSync(envPath)));
  }
}

for (const [key, value] of Object.entries(loadedEnv)) {
  if (value !== undefined && value !== '') {
    process.env[key] = value;
  }
}

const resolvedAzureConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const resolvedAzureContainerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'insurance-documents';

if (resolvedAzureConnectionString) {
  process.env.AZURE_STORAGE_CONNECTION_STRING = resolvedAzureConnectionString;
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
  azureStorageConnectionString: resolvedAzureConnectionString,
  azureStorageContainerName: resolvedAzureContainerName
};
