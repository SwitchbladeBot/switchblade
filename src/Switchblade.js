const { Client } = require('discord.js')
const translationBackend = require('i18next-node-fs-backend')

const FileUtils = require('./utils/FileUtils.js')
const { APIWrapper, Command, EventListener, Module } = require('./structures')
const { MongoDB } = require('./database')

/**
 * Custom Discord.js Client.
 * @constructor
 * @param {Object} options - Options for the client
 */
module.exports = class Switchblade extends Client {
  constructor (options = {}) {
    super(options)
    this.canvasLoaded = options.canvasLoaded

    this.apis = {}
    this.modules = {}

    this.commands = []
    this.cldr = { languages: {} }
    this.listeners = []
    this.playerManager = null
    this.i18next = require('i18next')

    this.initializeDatabase(MongoDB, { useNewUrlParser: true })
    this.initializeApis('src/apis').then(() => {
      this.initializeListeners('src/listeners')
      this.downloadAndInitializeLocales('src/locales').then(() => {
        this.initializeModules('src/modules').then(() => {
          this.initializeCommands('src/commands')
        })
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

  // Commands

  /**
   * Adds a new command to the Client.
   * @param {Command} command - Command to be added
   */
  addCommand (command) {
    if (!(command instanceof Command)) {
      this.log(`[31m${command} failed to load - Not a command`, 'Commands')
      return false
    }

    if (command.canLoad() !== true) {
      this.log(`[31m${command.name} failed to load - ${command.canLoad() || 'canLoad function did not return true.'}`, 'Commands')
      return false
    }

    if (command.requirements) {
      if (!command.requirements.apis.every(api => {
        if (!this.apis[api]) this.log(`[31m${command.name} failed to load - Required API wrapper "${api}" not found.`, 'Commands')
        return !!this.apis[api]
      })) return false

      if (!command.requirements.envVars.every(variable => {
        if (!process.env[variable]) this.log(`[31m${command.name} failed to load - Required environment variable "${variable}" is not set.`, 'Commands')
        return !!process.env[variable]
      })) return false

      if (command.requirements.canvasOnly && !this.canvasLoaded) {
        this.log(`[31m${command.name} failed to load - Canvas is not installed.`, 'Commands')
        return false
      }
    }

    this.commands.push(command)
    return true
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

  /**
   * Initializes all Client commands.
   * @param {string} dirPath - Path to the commands directory
   */
  initializeCommands (dirPath) {
    let success = 0
    let failed = 0
    FileUtils.requireDirectory(dirPath, (NewCommand) => {
      if (NewCommand.ignore) return
      this.addCommand(new NewCommand(this)) ? success++ : failed++
    }, this.logError).then(() => {
      this.log(failed ? `[33m${success} commands loaded, ${failed} failed.` : `[32mAll ${success} commands loaded without errors.`, 'Commands')
    }).catch(this.logError)
  }

  // Listeners

  /**
   * Adds a new listener to the Client.
   * @param {EventListener} listener - Listener to be added
   */
  addListener (listener) {
    if (!(listener instanceof EventListener)) {
      this.log(`[31m${listener.name} failed to load - Not an EventListener`, 'Listeners')
      return false
    }

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
    listener.events.forEach(event => {
      this.on(event, listener['on' + capitalize(event)])
    })

    this.listeners.push(listener)
    return true
  }

  /**
   * Initializes all Client listeners.
   * @param {string} dirPath - Path to the listeners directory
   */
  initializeListeners (dirPath) {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewListener) => {
      if (Object.getPrototypeOf(NewListener) !== EventListener) return
      this.addListener(new NewListener(this)) ? success++ : failed++
    }, this.logError).then(() => {
      this.log(failed ? `[33m${success} listeners loaded, ${failed} failed.` : `[32mAll ${success} listeners loaded without errors.`, 'Listeners')
    })
  }

  // APIs

  /**
   * Adds a new API Wrapper to the Client.
   * @param {APIWrapper} api - API Wrapper to be added
   */
  addApi (api) {
    if (!(api instanceof APIWrapper)) {
      this.log(`[31m${api.name} failed to load - Not an APIWrapper`, 'APIs')
      return false
    }

    if (api.canLoad() !== true) {
      this.log(`[31m${api.name} failed to load - ${api.canLoad() || 'canLoad function did not return true.'}`, 'APIs')
      return false
    }

    if (!api.envVars.every(variable => {
      if (!process.env[variable]) this.log(`[31m${api.name} failed to load - Required environment variable "${variable}" is not set.`, 'APIs')
      return !!process.env[variable]
    })) return false

    this.apis[api.name] = api.load()
    return true
  }

  /**
   * Initializes all API Wrappers.
   * @param {string} dirPath - Path to the apis directory
   */
  initializeApis (dirPath) {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewAPI) => {
      if (Object.getPrototypeOf(NewAPI) !== APIWrapper) return
      this.addApi(new NewAPI()) ? success++ : failed++
    }, this.logError).then(() => {
      this.log(failed ? `[33m${success} API wrappers loaded, ${failed} failed.` : `[32mAll ${success} API wrappers loaded without errors.`, 'APIs')
    })
  }

  /**
   * Adds a new module to the Client.
   * @param {Module} module - Module to be added
   */
  addModule (module) {
    if (!(module instanceof Module)) {
      this.log(`[31m${module.name} failed to load - Not an Module`, 'Modules')
      return false
    }

    if (module.canLoad() !== true) {
      this.log(`[31m${module.name} failed to load - ${module.canLoad() || 'canLoad function did not return true.'}`, 'APIs')
      return false
    }

    this.modules[module.name] = module.load()
    return true
  }

  /**
   * Initializes all modules.
   * @param {string} dirPath - Path to the modules directory
   */
  initializeModules (dirPath) {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewModule) => {
      if (Object.getPrototypeOf(NewModule) !== Module) return
      this.addModule(new NewModule(this)) ? success++ : failed++
    }, this.logError).then(() => {
      this.log(failed ? `[33m${success} modules loaded, ${failed} failed.` : `[32mAll ${success} modules loaded without errors.`, 'Modules')
    })
  }

  /**
   * Initializes i18next.
   * @param {string} dirPath - Path to the locales directory
   */
  downloadAndInitializeLocales (dirPath) {
    return new Promise(async (resolve, reject) => {
      if (this.apis.crowdin) {
        this.log('Downloading locales from Crowdin', 'Localization')
        try {
          await this.apis.crowdin.downloadToPath(dirPath)
          this.log('[32mLocales downloaded', 'Localization')
        } catch (e) {
          this.log('[31mCouldn\'t download locales - An error ocurred.', 'Localization')
          this.logError(e)
        }
      } else {
        this.log('[31mCouldn\'t download locales - API wrapper didn\'t load.', 'Localization')
      }

      try {
        this.i18next.use(translationBackend).init({
          ns: [ 'categories', 'commands', 'commons', 'errors', 'music', 'permissions', 'regions', 'moderation', 'lolservers' ],
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
          resolve(this.loadLanguagesDisplayNames(Object.keys(this.i18next.store.data)))
          this.log('[32mi18next initialized', 'Localization')
        })
      } catch (e) {
        this.logError(e)
      }
    })
  }

  /**
   * Loads language display names
   * @param {Array} codes
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
      .then(() => this.log('[32mDatabase connection established!', 'DB'))
      .catch(e => {
        this.logError('DB', e.message)
        this.database = null
      })
  }
}
