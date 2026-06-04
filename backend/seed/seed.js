const mongoose = require('mongoose');
const { mongodbUri } = require('../src/config/env');
const { logger } = require('../src/config/logger');
const { seedDefaultData } = require('../src/services/seedService');

async function seed() {
  await mongoose.connect(mongodbUri);
  await seedDefaultData();
  logger.info('Seed data inserted');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  logger.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
