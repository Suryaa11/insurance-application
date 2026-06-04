const mongoose = require('mongoose');
const { UPLOADED, UNDER_VERIFICATION, VERIFIED, REJECTED } = require('../constants/documentStatus');
const { IDENTITY_PROOF, ADDRESS_PROOF, INCOME_PROOF, SUPPORTING_DOCUMENT } = require('../constants/documentTypes');

const documentSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InsuranceApplication',
      required: true,
      index: true
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    documentName: {
      type: String,
      required: [true, 'Document name is required']
    },
    documentType: {
      type: String,
      enum: [IDENTITY_PROOF, ADDRESS_PROOF, INCOME_PROOF, SUPPORTING_DOCUMENT],
      required: true,
      index: true
    },
    filePath: {
      type: String,
      required: true
    },
    blobName: {
      type: String,
      default: ''
    },
    blobUrl: {
      type: String,
      default: ''
    },
    storageProvider: {
      type: String,
      default: 'AZURE_BLOB'
    },
    originalName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: [UPLOADED, UNDER_VERIFICATION, VERIFIED, REJECTED],
      default: UPLOADED,
      index: true
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: { createdAt: 'uploadedAt', updatedAt: 'updatedAt' } }
);

module.exports = mongoose.model('Document', documentSchema);
