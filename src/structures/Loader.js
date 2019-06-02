module.exports = class Loader {
  /**
   * @param {Client} client - Switchblade client
   * @param {Object} [options] - Options
   * @param {boolean} [options.critical] - If loader is critical
   */
  constructor (client, options = {}) {
    this.client = client
    this.critical = options.critical || false
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
