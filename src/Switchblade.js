const { Client } = require('discord.js')
const Logger = require('./utils/logger/Logger')
const Loaders = require('./loaders')

const Sentry = require('@sentry/node')
Sentry.init({ dsn: process.env.SENTRY_DSN })

/**
 * Custom Discord.js Client.
 * @constructor
 * @param {Object} options - Options for the client
 */
module.exports = class Switchblade extends Client {
  constructor (options = {}, sentry) {
    super(options)
    this.sentry = sentry
    this.canvasLoaded = options.canvasLoaded
    this.playerManager = null
    this.shardId = options.shardId
    this.logger = new Logger()

    this.loaded = false
  }

  async initialize () {
    const loaders = Object.values(Loaders).map(L => new L(this))
    const [preLoad, normal] = loaders.reduce(([pl, n], l) => (l.preLoad ? [[...pl, l], n] : [pl, [...n, l]]), [[], []])

    for (const l of preLoad) {
      await this.initializeLoader(l)
    }

    await this.login()
      .then(() => this.logger.info({ tag: 'Discord' }, 'Logged in successfully!'))
      .catch((e) => this.logger.error(e))

    for (const l of normal) {
      await this.initializeLoader(l)
    }

    this.loaded = true
  }

  async initializeLoader (loader) {
    let success = false
    try {
      success = await loader.load()
    } catch (e) {
      this.logger.error(e)
    } finally {
      if (!success && loader.critical) process.exit(1)
    }
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   * @param {string} [token] - Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   */
  login (token = process.env.DISCORD_TOKEN) {
    return super.login(token)
  }

  // Helpers

  /**
   * Runs a command.
   * @param {Command} command - Command to be runned
   * @param {CommandContext} context - CommandContext containing run information
   * @param {Array<string>} args - Array of command arguments
   * @param {String} language - Code for the language that the command will be executed in
   */
  async runCommand (command, context, args, language) {
    // Command rules
    if (context.guild && !command.hidden) {
      const deepSubcmd = (c, a) => {
        const [arg] = a
        const cmd = c.subcommands
          ? c.subcommands.find(s => s.name.toLowerCase() === arg || (s.aliases && s.aliases.includes(arg)))
          : null
        return cmd ? deepSubcmd(cmd, a.slice(1)) : c
      }
      const verify = await this.modules.commandRules.verifyCommand(deepSubcmd(command, args), context)
      if (!verify) return
    }

    context.setFixedT(this.i18next.getFixedT(language))
    return command._run(context, args).catch((e) => this.logger.error(e))
  }
}
