const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')
const Constants = require('../../utils/Constants.js')
const CommandError = require('./CommandError.js')

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

    this.hidden = false

    this.requirements = null // Run requirements
    this.parameters = null // Run parameters
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
  async _run (context, args) {
    args = this.handleParameters(context, args)
    if (args instanceof CommandError) return this.error(context, args.content, args.showUsage)

    const requirements = this.handleRequirements(context, args)
    if (requirements instanceof CommandError) return this.error(context, requirements.content, requirements.showUsage)

    args = Array.isArray(args) ? args : [args]
    return this.run(context, ...args)
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
  handleRequirements (context, args) {
    return this.requirements ? this.requirements.handle(context, args) : true
  }

  handleParameters (context, args) {
    return this.parameters ? this.parameters.handle(context, args) : args
  }

  /**
   * Apply command cooldown to an user
   * @param {User} user User that triggered it
   * @param {number} time Cooldown time in seconds
   */
  applyCooldown (user, time) {
    return this.requirements && this.requirements.applyCooldown(user, time)
  }

  error ({ t, author, channel }, content, showUsage = false) {
    const embedContent = typeof content === 'object'
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.ERROR_COLOR)
      .setTitle(embedContent ? content.title : content)

    if ((content.showUsage || showUsage) && !embedContent) {
      const usage = t(`commands:${this.name}.commandUsage`)
      const hasUsage = usage !== `${this.name}.commandUsage`
      if (hasUsage) embed.setDescription(`**${t('commons:usage')}:** \`${process.env.PREFIX}${this.name} ${usage}\``)
    } else if (embedContent) {
      embed.setDescription(content.description)
    }

    return channel.send(embed).then(() => channel.stopTyping())
  }
}
