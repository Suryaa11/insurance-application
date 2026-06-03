const mongoose = require('mongoose');
const { mongodbUri } = require('./env');
const { logger } = require('./logger');

async function connectDb() {
  await mongoose.connect(mongodbUri);
  logger.info('MongoDB connected');
}

module.exports = { connectDb };
