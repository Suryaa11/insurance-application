const InsurancePlan = require('../models/InsurancePlan');

const planRepository = {
  create: (data) => InsurancePlan.create(data),
  findAll: (filter = {}) => InsurancePlan.find(filter).sort({ createdAt: -1 }),
  findById: (id) => InsurancePlan.findById(id),
  updateById: (id, data) => InsurancePlan.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
  deleteById: (id) => InsurancePlan.findByIdAndDelete(id)
};

module.exports = planRepository;
