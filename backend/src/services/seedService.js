const User = require('../models/User');
const InsurancePlan = require('../models/InsurancePlan');
const { ADMIN } = require('../constants/roles');
const { logger } = require('../config/logger');

const defaultPlans = [
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
];

async function seedDefaultData() {
  const adminEmail = 'admin@insurance.com';
  const adminPassword = 'Admin@12345';

  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    const passwordHash = await User.hashPassword(adminPassword);
    await User.create({
      name: 'System Admin',
      email: adminEmail,
      passwordHash,
      role: ADMIN
    });
    logger.info('Seeded default admin user');
  } else {
    logger.info('Default admin user already exists');
  }

  for (const plan of defaultPlans) {
    await InsurancePlan.updateOne(
      { planName: plan.planName },
      { $set: { ...plan, isActive: true } },
      { upsert: true }
    );
  }

  logger.info('Seeded default insurance plans');
}

module.exports = { seedDefaultData };
