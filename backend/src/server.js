const app = require('./app');
const { connectDb } = require('./config/db');
const { port, azureStorageConnectionString, azureStorageContainerName } = require('./config/env');
const { logger } = require('./config/logger');
const { seedDefaultData } = require('./services/seedService');

async function start() {
  await connectDb();
  await seedDefaultData();
  if (azureStorageConnectionString && azureStorageContainerName) {
    logger.info(`Document storage mode: Azure Blob (${azureStorageContainerName})`);
  } else {
    logger.warn('Document storage mode: Azure Blob is not configured; uploads will fail until backend env vars are set');
  }

  app.listen(port, "0.0.0.0", () => {
    logger.info(`Server running on port ${port}`);
  });
}

start().catch((error) => {
  logger.error(error);
  process.exit(1);
});
