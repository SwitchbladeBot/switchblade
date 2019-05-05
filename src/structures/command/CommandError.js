module.exports = class CommandError extends Error {
  constructor (message, showUsage = false, stopTyping = true) {
    super(typeof message === 'object' ? 'EMBED_ERROR' : message)
    this.embed = typeof message === 'object' ? message : null
    this.showUsage = showUsage
    this.stopTyping = stopTyping
  }
}
