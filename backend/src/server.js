const app = require('./app');
const { connectDb } = require('./config/db');
const { port } = require('./config/env');
const { logger } = require('./config/logger');
const { seedDefaultData } = require('./services/seedService');

async function start() {
  await connectDb();
  await seedDefaultData();

  app.listen(port, "0.0.0.0", () => {
    logger.info(`Server running on port ${port}`);
  });
}

start().catch((error) => {
  logger.error(error);
  process.exit(1);
});
