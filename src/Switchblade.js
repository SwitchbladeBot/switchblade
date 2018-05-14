const { Client } = require('discord.js')
const fs = require('fs')
const path = require('path')

const { Command } = require('./structures')

/**
 * Custom Discord.js Client.
 * @constructor
 * @param {Object} options - Options for the client
 */
module.exports = class Switchblade extends Client {
  constructor (options = {}) {
    super(options)
    this.commands = []
    this.listeners = []

    this.initializeCommands('./commands') // Custom commands directory?
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   * @param {string} token - Token of the account to log in with
   */
  login (token) {
    token = token || process.env.DISCORD_TOKEN
    super.login(token)
  }

  // Helpers

  /**
   * Adds a new log entry to the console.
   * @param {string} message - Log message
   * @param {...string} tags - Tags to identify the log entry
   */
  log (...args) {
    if (args.length < 1) return

    let message = args[0]
    const tags = args.slice(1)
    if (tags.length > 0) {
      const text = tags.map(t => `[${t}]`)
      text.push(message)
      message = text.join(' ')
    }

    console.log(message)
  }

  /**
   * Adds a new error log entry to the console.
   * @param {string} message - Error message
   * @param {boolean} fullStack - Whether to log the error stacktrace
   */
  logError (message, fullStack) {
    if (fullStack) console.error(message)
    this.log(message, 'ErrorLog')
  }

  // Commands

  /**
   * Adds a new command to the Client.
   * @param {Command} command - Command to be added
   */
  addCommand (command) {
    if (command instanceof Command) {
      this.commands.push(command)
    }
  }

  /**
   * Runs a command.
   * @param {Command} command - Command to be runned
   * @param {Message} message - Message that triggered the command
   * @param {Array<string>} args - Array of command arguments
   */
  runCommand (command, message, args) {
    if (command.canRun(message, args)) {
      command._run(message, args)
    }
  }

  /**
   * Initializes all Client commands.
   * @param {string} dirPath - Path to the commands directory
   */
  initializeCommands (dirPath) {
    try {
      const files = fs.readdirSync(dirPath)
      this.log(`Loading ${files.length} commands.`, 'Commands')
      files.forEach(file => {
        if (file.endsWith('.js')) {
          const RequiredCommand = require(path.resolve(dirPath, file))
          this.addCommand(new RequiredCommand(this))

          // Logging system?
          this.log(`${file} loaded.`, 'Commands')
        } else if (fs.statSync(path.resolve(dirPath, file)).isDirectory()) {
          this.initializeCommands(path.resolve(dirPath, file))
        }
      })
    } catch (e) {
      // Error handling?
      this.logError(e, true)
    }
  }
}
