const { Client } = require('discord.js')
const i18next = require('i18next')
const translationBackend = require('i18next-node-fs-backend')

const FileUtils = require('./utils/FileUtils.js')
const { Command, EventListener, APIWrapper } = require('./structures')
const { MongoDB } = require('./database')

/**
 * Custom Discord.js Client.
 * @constructor
 * @param {Object} options - Options for the client
 */
module.exports = class Switchblade extends Client {
  constructor (options = {}) {
    console.log(
      '   _____         _ _       _     _     _           _      \n' +
      '  / ____|       (_| |     | |   | |   | |         | |     \n' +
      ' | (_____      ___| |_ ___| |__ | |__ | | __ _  __| | ___ \n' +
      '  \\___ \\ \\ /\\ / | | __/ __| \'_ \\| \'_ \\| |/ _` |/ _` |/ _ \\\n' +
      '  ____) \\ V  V /| | || (__| | | | |_) | | (_| | (_| |  __/\n' +
      ' |_____/ \\_/\\_/ |_|\\__\\___|_| |_|_.__/|_|\\__,_|\\__,_|\\___|\n')

    super(options)
    this.apis = {}
    this.commands = []
    this.cldr = { languages: {} }
    this.listeners = []
    this.playerManager = null

    this.initializeDatabase(MongoDB, { useNewUrlParser: true })
    this.initializeApis('src/apis').then(() => {
      this.initializeListeners('src/listeners')
      this.downloadAndInitializeLocales('src/locales').then(() => {
        this.initializeCommands('src/commands')
      })
    })
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

  // Helpers

  /**
   * Adds a new log entry to the console.
   * @param {string} message - Log message
   * @param {...string} [tags] - Tags to identify the log entry
   */
  log (...args) {
    const message = args[0]
    const tags = args.slice(1).map(t => `[${t}]`)
    console.log(...tags, message)
  }

  /**
   * Adds a new error log entry to the console.
   * @param {string} message - Error message
   */
  logError (...args) {
    const tags = args.length > 1 ? args.slice(0, -1).map(t => `[${t}]`) : []
    console.error('[ErrorLog]', ...tags, args[args.length - 1])
  }

  // Commands

  /**
   * Adds a new command to the Client.
   * @param {Command} command - Command to be added
   */
  addCommand (command) {
    if (command instanceof Command && command.canLoad()) {
      this.commands.push(command)
    }
  }

  /**
   * Runs a command.
   * @param {Command} command - Command to be runned
   * @param {CommandContext} context - CommandContext containing run information
   * @param {Array<string>} args - Array of command arguments
   * @param {String} language - Code for the language that the command will be executed in
   */
  runCommand (command, context, args, language) {
    context.setFixedT(i18next.getFixedT(language))
    command._run(context, args).catch(this.logError)
  }

  /**
   * Initializes all Client commands.
   * @param {string} dirPath - Path to the commands directory
   */
  initializeCommands (dirPath) {
    return FileUtils.requireDirectory(dirPath, (NewCommand) => {
      if (Object.getPrototypeOf(NewCommand) !== Command || NewCommand.ignore) return
      this.addCommand(new NewCommand(this))
      this.log(`${NewCommand.name} loaded.`, 'Commands')
    }, this.logError)
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
    return FileUtils.requireDirectory(dirPath, (NewListener) => {
      if (Object.getPrototypeOf(NewListener) !== EventListener) return
      this.addListener(new NewListener(this))
      this.log(`${NewListener.name} loaded.`, 'Listeners')
    }, this.logError)
  }

  // APIs

  /**
   * Adds a new API Wrapper to the Client.
   * @param {Object} api - API Wrapper to be added
   */
  addApi (api) {
    if (api instanceof APIWrapper && api.canLoad()) {
      this.apis[api.name] = api.load()
    }
  }

  /**
   * Initializes all API Wrappers.
   * @param {string} dirPath - Path to the listeners directory
   */
  initializeApis (dirPath) {
    return FileUtils.requireDirectory(dirPath, (NewAPI) => {
      if (Object.getPrototypeOf(NewAPI) !== APIWrapper) return
      this.addApi(new NewAPI())
      this.log(`${NewAPI.name} loaded.`, 'APIs')
    }, this.logError)
  }

  /**
   * Initializes i18next.
   */
  downloadAndInitializeLocales (dirPath) {
    return new Promise(async (resolve, reject) => {
      if (this.apis.crowdin) {
        this.log('Downloading locales from Crowdin', 'Localization')
        await this.apis.crowdin.downloadToPath(dirPath)
      } else {
        this.log('Couldn\'t download locales from Crowdin', 'Localization')
      }

      try {
        i18next.use(translationBackend).init({
          ns: ['commands', 'commons', 'permissions', 'errors', 'music', 'regions'],
          preload: await FileUtils.readdir(dirPath),
          fallbackLng: 'en-US',
          backend: {
            loadPath: `${dirPath}/{{lng}}/{{ns}}.json`
          },
          interpolation: {
            escapeValue: false
          },
          returnEmptyString: false
        }, () => {
          resolve(this.loadLanguagesDisplayNames(Object.keys(i18next.store.data)))
          this.log('Locales downloaded successfully and i18next initialized', 'Localization')
        })
      } catch (e) {
        this.logError(e)
      }
    })
  }

  /**
   * Loads language display names
   */
  async loadLanguagesDisplayNames (codes) {
    const lw = (s) => s.toLowerCase()
    const langs = codes.reduce((o, l) => { o[l] = {}; return o }, {})
    codes.forEach(lc => {
      let [ language ] = lc.split('-')
      try {
        const { main } = require(`cldr-localenames-modern/main/${language}/languages`)
        const display = main[language].localeDisplayNames.languages
        codes.forEach(l => {
          const langObj = langs[l][lc] = []
          let [ lcode ] = l.split('-')
          if (codes.filter(c => c.startsWith(lcode)).length === 1 && display[lcode]) {
            langObj.push(lw(display[lcode]))
          }
          if (display[l]) langObj.push(lw(display[l]))
        })
      } catch (e) {}
    })
    this.cldr.languages = langs
    return langs
  }

  // Database
  initializeDatabase (DBWrapper, options = {}) {
    this.database = new DBWrapper(options)
    this.database.connect()
      .then(() => this.log('Database connection established!', 'DB'))
      .catch(e => {
        this.logError(e.message, 'DB')
        this.database = null
      })
  }
}
