const Utils = require('../utils')

module.exports = class EventListener {
  /**
   * @param {Object} opts
   * @param {string[]} opts.events
   * @param {Client} client
   */
  constructor (opts, client) {
    const options = Utils.createOptionHandler('EventListener', opts)

    this.events = options.required('events')

    this.client = client
  }
}
