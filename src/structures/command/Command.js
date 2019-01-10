const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')
const Constants = require('../../utils/Constants.js')
const CommandError = require('./CommandError.js')

/**
 * Base command structure.
 * @constructor
 * @param {Switchblade} client - Switchblade client
 */
module.exports = class Command {
  constructor (client, parentCommand) {
    this.client = client

    this.name = 'CommandName'
    this.aliases = []
    this.category = 'general'

    this.hidden = false

    this.subcommands = []

    this.requirements = null // Run requirements
    this.parameters = null // Run parameters
    this.parentCommand = parentCommand
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
    try {
      this.handleRequirements(context, args)
    } catch (e) {
      return this.error(context, e)
    }

    const [ subcmd ] = args
    const subcommand = this.subcommands.find(c => c.name.toLowerCase() === subcmd || c.aliases.includes(subcmd))
    if (subcommand) {
      return subcommand._run(context, args.splice(1))
    }

    try {
      args = this.handleParameters(context, args)
    } catch (e) {
      return this.error(context, e)
    }

    this.applyCooldown(context.author)

    try {
      const result = await this.run(context, ...args)
      return result
    } catch (e) {
      this.error(context, e)
    }
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

  error ({ t, author, channel, prefix }, error) {
    if (error instanceof CommandError) {
      const usage = this.usage(t, prefix)
      const embed = error.embed || new SwitchbladeEmbed(author)
        .setTitle(error.message)
        .setDescription(error.showUsage ? usage : '')
      return channel.send(embed.setColor(Constants.ERROR_COLOR)).then(() => channel.stopTyping())
    }
    console.error(error)
  }

  get tPath () {
    return this.parentCommand ? `${this.parentCommand.tPath}.subcommands.${this.name}` : `${this.name}`
  }

  get fullName () {
    return this.parentCommand ? `${this.parentCommand.fullName} ${this.name}` : this.name
  }

  usage (t, prefix, noUsage = true) {
    const usagePath = `${this.tPath}.commandUsage`
    const usage = noUsage ? t(`commands:${usagePath}`) : t([`commands:${usagePath}`, ''])
    if (usage !== usagePath) {
      return `**${t('commons:usage')}:** \`${prefix}${this.fullName} ${usage}\``
    }
  }
}
