module.exports = class CommandError extends Error {
  constructor (content, showUsage = false) {
    super(typeof content === 'string' ? content : content.title)
    this.content = content
    this.showUsage = showUsage
  }
}
