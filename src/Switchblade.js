const { Client } = require('discord.js')
const fs = require('fs')
const path = require('path')

const { Command, EventListener } = require('./structures')

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

    this.initializeCommands('./src/commands') // Custom commands directory?
    this.initializeListeners('./src/listeners') // Custom listeners directory?
  }

  /**
   * Logs the client in, establishing a websocket connection to Discord.
   * @param {string} [token] - Token of the account to log in with
   */
  login (token) {
    return new Promise((resolve, reject) => {
      token = token || process.env.DISCORD_TOKEN
      super.login(token).then(resolve).catch(reject)
    })
  }

  // Helpers

  /**
   * Adds a new log entry to the console.
   * @param {string} message - Log message
   * @param {...string} [tags] - Tags to identify the log entry
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
   * @param {boolean} [fullStack] - Whether to log the error stacktrace
   */
  logError (message, fullStack = false) {
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
      fs.readdirSync(dirPath).forEach(file => {
        if (file.endsWith('.js')) {
          const RequiredCommand = require(path.resolve(dirPath, file))
          this.addCommand(new RequiredCommand(this))
          this.log(`${file} loaded.`, 'Commands')
        } else if (fs.statSync(path.resolve(dirPath, file)).isDirectory()) {
          this.initializeCommands(path.resolve(dirPath, file))
        }
      })
    } catch (e) {
      this.logError(e, true)
    }
  }

  // Listeners

  /**
   * Adds a new listener to the Client.
   * @param {EventListener} listener - Listener to be added
   */
  addListener (listener) {
    if (listener instanceof EventListener) {
      const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

      listener.events.forEach(event => {
        this.on(event, listener['on' + capitalize(event)])
      })

      this.listeners.push(listener)
    }
  }

  /**
   * Initializes all Client listeners.
   * @param {string} dirPath - Path to the listeners directory
   */
  initializeListeners (dirPath) {
    try {
      fs.readdirSync(dirPath).forEach(file => {
        if (file.endsWith('.js')) {
          const RequiredListener = require(path.resolve(dirPath, file))
          this.addListener(new RequiredListener(this))
          this.log(`${file} loaded.`, 'Listeners')
        } else if (fs.statSync(path.resolve(dirPath, file)).isDirectory()) {
          this.initializeListeners(path.resolve(dirPath, file))
        }
      })
    } catch (e) {
      this.logError(e, true)
    }
  }
}
