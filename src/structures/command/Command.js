const Utils = require('../../utils')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')
const Constants = require('../../utils/Constants.js')

const CommandError = require('./CommandError.js')
const CommandRequirements = require('./CommandRequirements.js')
const CommandParameters = require('./parameters/CommandParameters.js')

module.exports = class Command {
  /**
   * @param {Object} opts
   * @param {string} opts.name
   * @param {string[]} [opts.aliases]
   * @param {string} [opts.category]
   * @param {boolean} [opts.hidden]
   * @param {string} [opts.parent]
   * @param {Object} [opts.requirements]
   * @param {Object} [opts.parameters]
   * @param {Client} client
   */
  constructor (opts, client) {
    const options = Utils.createOptionHandler('Command', opts)

    this.name = options.required('name')
    this.aliases = options.optional('aliases')
    this.category = options.optional('category', 'general')
    this.hidden = options.optional('hidden', false)
    this.parentCommand = options.optional('parent')
    this.requirements = options.optional('requirements')
    this.parameters = options.optional('parameters')

    this.client = client

    this.subcommands = []
    this.cooldownTime = 0
    this.cooldownFeedback = true
    this.cooldownMap = this.cooldownTime > 0 ? new Map() : null
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
      await this.handleRequirements(context, args)
    } catch (e) {
      return this.error(context, e)
    }

    const [subcmd] = args
    const subcommand = this.subcommands.find(c => c.name.toLowerCase() === subcmd || (c.aliases && c.aliases.includes(subcmd)))
    if (subcommand) {
      return subcommand._run(context, args.splice(1))
    }

    try {
      args = await this.handleParameters(context, args)
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
    return this.requirements ? CommandRequirements.handle(context, this.requirements, args) : true
  }

  handleParameters (context, args) {
    return this.parameters ? CommandParameters.handle(context, this.parameters, args) : args
  }

  /**
   * Apply command cooldown to an user
   * @param {User} user User that triggered it
   * @param {number} time Cooldown time in seconds
   */
  applyCooldown (user, time) {
    if (!user || !this.cooldownTime > 0) return false
    if (!this.cooldownMap.has(user.id)) {
      this.cooldownMap.set(user.id, Date.now())
      user.client.setTimeout(() => this.cooldownMap.delete(user.id), time * 1000)
    }
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

  // TODO: Add an alias parameter that lets you replace the alias shown in the usage
  usage (t, prefix, noUsage = true, onlyCommand = false) {
    const usagePath = `${this.tPath}.commandUsage`
    const usage = noUsage ? t(`commands:${usagePath}`) : t([`commands:${usagePath}`, ''])
    if (usage !== usagePath && !onlyCommand) {
      return `**${t('commons:usage')}:** \`${prefix}${this.fullName}${usage ? ' ' + usage : ''}\``
    } else if (usage !== usagePath && onlyCommand) {
      return `${prefix}${this.fullName}${usage ? ' ' + usage : ''}`
    }
  }

  asJSON (t, command = this) {
    const aliases = command.aliases && command.aliases.length ? command.aliases : undefined
    const usage = t([`commands:${command.tPath}.commandUsage`, '']) !== '' ? t(`commands:${command.tPath}.commandUsage`) : undefined
    const subcommands = command.subcommands.length > 0 ? command.subcommands.map(sc => this.asJSON(t, sc)) : undefined

    return {
      name: command.fullName,
      category: command.category || command.parent.category,
      aliases,
      description: t(`commands:${command.tPath}.commandDescription`),
      usage,
      subcommands
    }
  }

  getEmoji (emoji, fallback) {
    return this.client.officialEmojis.get(emoji, fallback)
  }
}
