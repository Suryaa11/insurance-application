const dotenv = require('dotenv');

dotenv.config();

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
  azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING || '',
  azureStorageContainerName: process.env.AZURE_STORAGE_CONTAINER_NAME || ''
};
