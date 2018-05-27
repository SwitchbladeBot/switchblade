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

    this.hidden = false

    this.cooldownFeedback = false
    this.cooldown = new Map()
  }

  /**
   * Returns true if it can load
   * @returns {boolean} Whether this command can load
   */
  canLoad () {
    return true
  }

  /**
   * Pre-executes itself
   * @param {Message} message Message that triggered it
   * @param {Array<string>} args Command arguments
   */
  async _run (message, args, t) {
    return this.run(message, args, t)
  }

  /**
   * Executes itself
   * @param {Message} message Message that triggered it
   * @param {Array<string>} args Command arguments
   */
  async run () {}

  /**
   * Returns true if it can run
   * @param {Message} message Message that triggered it
   * @param {Array<string>} args Command arguments
   * @returns {boolean} Whether this command can run
   */
  canRun (message, args) {
    if (this.permissions.length > 0) {
      if (!message.guild || !message.channel.permissionsFor(message.member).has(this.permissions)) {
        return false
      }
    }

    if (this.userIDs.length > 0) {
      if (!this.userIDs.includes(message.author.id)) {
        return false
      }
    }

    if (this.cooldown.has(message.author.id)) {
      if (this.cooldownFeedback) {
        this.cooldownMessage(message)
      }
      return false
    }

    return true
  }

  // Cooldown

  /**
   * Apply command cooldown to an user
   * @param {User} user User that triggered it
   * @param {number} time Cooldown time in seconds
   */
  cooldownUser (user, time) {
    if (!this.cooldown.has(user.id)) {
      this.cooldown.set(user.id, Date.now())
      this.client.setTimeout(() => {
        this.cooldown.delete(user.id)
      }, time * 1000)
    }
  }

  /**
   * Send cooldown message
   * @param {Message} message Message that triggered the cooldown
   */
  cooldownMessage (message) {
    message.channel.send('Woah! Slow down buddy! You\'re going too fast, you need to wait!') // "You need to wait X seconds!" in the future?
  }
}
