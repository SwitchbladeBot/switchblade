/**
 * Base event listener structure.
 * @constructor
 * @param {Switchblade} client - Switchblade client
 * @param {Object} [options] - Options
 * @param {string[]} [options.events] - Events heard by listener
 */
module.exports = class EventListener {
  constructor (client, options = {}) {
    this.client = client
    this.events = options.events || []
  }
}
