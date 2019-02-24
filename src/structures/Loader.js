module.exports = class Loader {
  constructor (client) {
    this.client = client
    this.critical = false
  }

  load (client) {
    return true
  }

  log (...args) {
    return this.client.log(...args)
  }

  logError (...args) {
    return this.client.logError(...args)
  }
}
