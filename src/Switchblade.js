const { Client } = require('discord.js')
const Loaders = require('./loaders')
const winston = require('winston')

/**
 * Custom Discord.js Client.
 * @constructor
 * @param {Object} options - Options for the client
 */
module.exports = class Switchblade extends Client {
  constructor (options = {}) {
    super(options)
    this.canvasLoaded = options.canvasLoaded
    this.playerManager = null
    this.initializeWinston()
    this.initializeLoaders()
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   * @param {string} [token] - Token of the account to log in with
   * @returns {Promise<string>} Token of the account used
   */
  login (token) {
    token = token || process.env.DISCORD_TOKEN
    return super.login(token)
  }

  /**
   * Runs a command.
   * @param {Command} command - Command to be runned
   * @param {CommandContext} context - CommandContext containing run information
   * @param {Array<string>} args - Array of command arguments
   * @param {String} language - Code for the language that the command will be executed in
   */
  runCommand (command, context, args, language) {
    context.setFixedT(this.i18next.getFixedT(language))
    command._run(context, args).catch(e => this.logger.error(e, { label: 'commands', command: command.constructor.name, context, language, args }))
  }

  async initializeLoaders () {
    for (let Loader of Object.values(Loaders)) {
      const loader = new Loader(this)
      let success = false
      try {
        success = await loader.load()
      } catch (e) {
        this.logger.error(e, { label: loader.constructor.name })
      } finally {
        if (!success && loader.critical) process.exit(1)
      }
    }
  }

  initializeWinston () {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(
              info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
            )
          ),
          level: 'silly'
        })
      ]
    })
  }
}
