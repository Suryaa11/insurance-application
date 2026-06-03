const mongoose = require('mongoose');
const { SUBMITTED, PENDING_VERIFICATION, APPROVED, REJECTED } = require('../constants/applicationStatus');

const applicationSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    selectedPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InsurancePlan',
      required: true,
      index: true
    },
    personalInformation: {
      firstName: String,
      lastName: String,
      dateOfBirth: String,
      gender: String,
      phone: String,
      email: String,
      occupation: String
    },
    addressInformation: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    nomineeInformation: {
      name: String,
      relationship: String,
      phone: String,
      email: String
    },
    status: {
      type: String,
      enum: [SUBMITTED, PENDING_VERIFICATION, APPROVED, REJECTED],
      default: SUBMITTED,
      index: true
    },
    approvalComments: {
      type: String,
      default: ''
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('InsuranceApplication', applicationSchema);
