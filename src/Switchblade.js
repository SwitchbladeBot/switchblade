const { Client } = require('discord.js')
const chalk = require('chalk')
const _ = require('lodash')
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

    this.logError = this.logError.bind(this)
    this.loaded = false
  }

  async initialize () {
    const loaders = Object.values(Loaders).map(L => new L(this))
    const [preLoad, normal] = loaders.reduce(([pl, n], l) => (l.preLoad ? [[...pl, l], n] : [pl, [...n, l]]), [[], []])

    for (const l of preLoad) {
      await this.initializeLoader(l)
    }

    await this.login()
      .then(() => this.log('Logged in successfully!', { color: 'green', tags: ['Discord'] }))
      .catch(this.logError)

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
      this.logError(e)
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
   * Adds a new log entry to the console.
   * @param {string} message - Log message
   * @param {Object} [options] - Options
   * @param {string[]} [options.tags] - Tags to identify the log entry
   * @param {boolean} [options.bold] - If message will be bold
   * @param {boolean} [options.italic] - If message will be italic
   * @param {boolean} [options.underline] - If message will be underline
   * @param {boolean} [options.reversed] - If message will be reversed
   * @param {'bgBlack'|'bgBlackBright'|'bgRed'|'bgRedBright'|'bgGreen'|'bgGreenBright'|'bgYellow'|'bgYellowBright'|'bgBlue'|'bgBlueBright'|'bgMagenta'|'bgMagentaBright'|'bgCyan'|'bgCyanBright'|'bgWhite'|'bgWhiteBright'} [options.bgColor] - Background color of message
   * @param {'black'|'blackBright'|'red'|'redBright'|'green'|'greenBright'|'yellow'|'yellowBright'|'blue'|'blueBright'|'magenta'|'magentaBright'|'cyan'|'cyanBright'|'white'|'whiteBright'} [options.color] - Color of message
   */
  log (
    message,
    {
      tags = [],
      bold = false,
      italic = false,
      underline = false,
      reversed = false,
      bgColor = false,
      color = 'white'
    } = {}
  ) {
    const colorFunction = _.get(
      chalk,
      [bold, italic, underline, reversed, bgColor, color].filter(Boolean).join('.')
    )

    console.log(...tags.map(t => chalk.cyan(`[${t}]`)), colorFunction(message))
  }

  /**
   * Adds a new error log entry to the console.
   * @param {string} message - Error message
   */
  logError (...args) {
    Sentry.captureException(args[args.length - 1])
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
    return command._run(context, args).catch(this.logError)
  }
}
