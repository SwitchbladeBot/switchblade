module.exports = class ParameterError extends Error {
  constructor (message, showUsage = false) {
    super(message)
    this.showUsage = showUsage
  }
}
