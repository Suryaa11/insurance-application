const mongoose = require('mongoose');

const planSchema = new mongoose.Schema(
  {
    planName: {
      type: String,
      required: [true, 'Plan name is required'],
      unique: true,
      trim: true,
      maxlength: 120
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: 2000
    },
    coverageAmount: {
      type: Number,
      required: [true, 'Coverage amount is required'],
      min: 0
    },
    premiumAmount: {
      type: Number,
      required: [true, 'Premium amount is required'],
      min: 0
    },
    eligibilityCriteria: {
      type: String,
      required: [true, 'Eligibility criteria is required'],
      maxlength: 2000
    },
    benefits: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InsurancePlan', planSchema);
