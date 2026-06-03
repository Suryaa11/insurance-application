const ApiError = require('../utils/ApiError');
const planRepository = require('../repositories/planRepository');

const planService = {
  list: async () => {
    return planRepository.findAll({ isActive: true });
  },
  listAll: async () => {
    return planRepository.findAll();
  },
  getById: async (id) => {
    const plan = await planRepository.findById(id);
    if (!plan) {
      throw new ApiError(404, 'Plan not found');
    }
    return plan;
  },
  create: async (data) => planRepository.create(data),
  update: async (id, data) => {
    const plan = await planRepository.updateById(id, data);
    if (!plan) {
      throw new ApiError(404, 'Plan not found');
    }
    return plan;
  },
  remove: async (id) => {
    const plan = await planRepository.deleteById(id);
    if (!plan) {
      throw new ApiError(404, 'Plan not found');
    }
    return plan;
  }
};

module.exports = planService;
