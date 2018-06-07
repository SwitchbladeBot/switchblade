module.exports = class CommandError extends Error {
  constructor (message, showUsage = false) {
    super(message)
    this.showUsage = showUsage
  }
}
