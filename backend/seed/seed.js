const mongoose = require('mongoose');
const { mongodbUri } = require('../src/config/env');
const User = require('../src/models/User');
const InsurancePlan = require('../src/models/InsurancePlan');
const { ADMIN } = require('../src/constants/roles');
const { logger } = require('../src/config/logger');

async function seed() {
  await mongoose.connect(mongodbUri);
  await Promise.all([
    User.deleteMany({}),
    InsurancePlan.deleteMany({})
  ]);

  const adminPasswordHash = await User.hashPassword('Admin@12345');
  await User.create({
    name: 'System Admin',
    email: 'admin@insurance.com',
    passwordHash: adminPasswordHash,
    role: ADMIN
  });

  await InsurancePlan.insertMany([
    {
      planName: 'Health Insurance',
      description: 'Comprehensive coverage for hospitalization, treatments, and critical care.',
      coverageAmount: 1000000,
      premiumAmount: 12000,
      eligibilityCriteria: 'Residents aged 18 to 65 with valid identity proof.',
      benefits: ['Cashless hospitalization', 'Annual health checkup', 'Critical illness cover']
    },
    {
      planName: 'Life Insurance',
      description: 'Financial protection for family with flexible term and savings options.',
      coverageAmount: 5000000,
      premiumAmount: 18000,
      eligibilityCriteria: 'Adults aged 18 to 60 with income proof.',
      benefits: ['Tax benefits', 'Family protection', 'Maturity benefits']
    },
    {
      planName: 'Vehicle Insurance',
      description: 'Covers accidental damage, theft, and third-party liabilities.',
      coverageAmount: 750000,
      premiumAmount: 8000,
      eligibilityCriteria: 'Registered vehicle with valid RC and driving license.',
      benefits: ['Roadside assistance', 'Third-party liability', 'Own damage cover']
    },
    {
      planName: 'Home Insurance',
      description: 'Protects property and contents against fire, theft, and natural disasters.',
      coverageAmount: 3000000,
      premiumAmount: 15000,
      eligibilityCriteria: 'Home ownership proof and property documentation.',
      benefits: ['Structure cover', 'Contents cover', 'Natural calamity protection']
    }
  ]);

  logger.info('Seed data inserted');
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  logger.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
