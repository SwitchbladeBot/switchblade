module.exports = {
  default: (value, defaultValue) => typeof value === 'undefined' ? defaultValue : value
}
