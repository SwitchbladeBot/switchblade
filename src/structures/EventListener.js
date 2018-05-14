/**
 * Base event listener structure.
 * @constructor
 * @param {Switchblade} client - Switchblade client
 */
module.exports = class EventListener {
  constructor (client) {
    this.client = client
    this.events = []
  }
}
