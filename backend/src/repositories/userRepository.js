const User = require('../models/User');

const userRepository = {
  create: (data) => User.create(data),
  findByEmail: (email) => User.findOne({ email }),
  findById: (id) => User.findById(id),
  findByIdWithPassword: (id) => User.findById(id),
  updateById: (id, data) => User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
};

module.exports = userRepository;
