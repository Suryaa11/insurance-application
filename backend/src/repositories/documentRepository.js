const Document = require('../models/Document');

const documentRepository = {
  create: (data) => Document.create(data),
  findById: (id) => Document.findById(id).populate('application customer reviewedBy'),
  findByIdRaw: (id) => Document.findById(id),
  findByApplication: (applicationId) => Document.find({ application: applicationId }).sort({ uploadedAt: -1 }),
  findByCustomer: (customerId) => Document.find({ customer: customerId }).sort({ uploadedAt: -1 }),
  updateById: (id, data) => Document.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  countByApplication: (applicationId) => Document.countDocuments({ application: applicationId })
};

module.exports = documentRepository;
