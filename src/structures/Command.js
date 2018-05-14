/**
 * Base command structure.
 * @constructor
 * @param {Switchblade} client - Switchblade client
 */
module.exports = class Command {
  constructor (client) {
    this.client = client
    this.name = 'CommandName'
    this.aliases = []
    this.permissions = []
    this.userIDs = []
  }

  /**
   * Pre-executes itself
   * @param {Message} message Message that triggered it
   * @param {Array<string>} args Command arguments
   */
  _run (message, args) {
    return this.run(message, args)
  }

  /**
   * Executes itself
   * @param {Message} message Message that triggered it
   * @param {Array<string>} args Command arguments
   */
  run () {}

  /**
   * Returns true if it can run
   * @param {Message} message Message that triggered it
   * @param {Array<string>} args Command arguments
   * @returns {boolean} Whether this command can run
   */
  canRun (message, args) {
    let can = true
    if (this.permissions.length > 0) {
      if (!message.guild) {
        return false
      }

      if (message.channel.permissionsFor(message.member).has(this.permissions)) {
        can = true
      } else {
        return false
      }
    }

    if (this.userIDs.length > 0) {
      if (this.userIDs.includes(message.author.id)) {
        can = true
      } else {
        return false
      }
    }

    return can
  }
}
