const InsuranceApplication = require('../models/InsuranceApplication');

const applicationRepository = {
  create: (data) => InsuranceApplication.create(data),
  findById: (id) => InsuranceApplication.findById(id).populate('customer selectedPlan reviewedBy'),
  findByIdRaw: (id) => InsuranceApplication.findById(id),
  findByCustomer: (customerId) => InsuranceApplication.find({ customer: customerId }).populate('selectedPlan').sort({ createdAt: -1 }),
  updateById: (id, data) => InsuranceApplication.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  countDocuments: (filter = {}) => InsuranceApplication.countDocuments(filter)
};

module.exports = applicationRepository;
