function createApplicationNumber() {
  const suffix = Date.now().toString(36).toUpperCase();
  return `APP-${suffix}`;
}

module.exports = { createApplicationNumber };
