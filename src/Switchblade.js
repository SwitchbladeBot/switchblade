const { Client } = require('discord.js')
const Loaders = require('./loaders')

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

    this.initializeLoaders()
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
   * Adds a new log entry to the console.
   * @param {string} message - Log message
   * @param {...string} [tags] - Tags to identify the log entry
   */
  log (...args) {
    const message = args[0]
    const tags = args.slice(1).map(t => `[36m[${t}][0m`)
    console.log(...tags, message + '[0m')
  }

  /**
   * Adds a new error log entry to the console.
   * @param {string} message - Error message
   */
  logError (...args) {
    const tags = args.length > 1 ? args.slice(0, -1).map(t => `[${t}]`) : []
    console.error('[ErrorLog]', ...tags, args[args.length - 1])
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
    command._run(context, args).catch(this.logError)
  }

  async initializeLoaders () {
    for (let name in Loaders) {
      const loader = new Loaders[name](this)
      let success = false
      try {
        success = await loader.load()
      } catch (e) {
        this.logError(e)
      } finally {
        if (!success && loader.critical) process.exit(1)
      }
    }
  }
}
