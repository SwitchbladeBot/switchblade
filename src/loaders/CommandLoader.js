const { Loader, Command, FileUtils } = require('../')

module.exports = class CommandLoader extends Loader {
  constructor (client) {
    super(client)
    this.critical = true

    this.commands = []
    this.posLoadCommands = []
  }

  async load () {
    try {
      await this.initializeCommands()
      this.client.commands = this.commands
      return true
    } catch (e) {
      this.client.logger.error(e, { label: this.constructor.name })
    }
    return false
  }

  /**
   * Initializes all Client commands.
   * @param {string} dirPath - Path to the commands directory
   */
  initializeCommands (dirPath = 'src/commands') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewCommand) => {
      this.addCommand(new NewCommand(this.client)) ? success++ : failed++
    }, (e) => {
      this.client.logger.error(e, { label: this.constructor.name })
    }).then(() => {
      if (!failed) {
        this.client.logger.info('All commands loaded successfully', { label: this.constructor.name })
      }
    })
  }

  /**
   * Adds a new command to the Client.
   * @param {Command} command - Command to be added
   */
  addCommand (command) {
    const check = this.checkCommand(command)
    if (!check) return check

    if (typeof command.parentCommand === 'string' || Array.isArray(command.parentCommand)) {
      this.posLoadCommands.push(command)
    } else {
      this.commands.push(command)
    }

    return check
  }

  addSubcommand (subCommand) {
    const check = this.checkCommand(subCommand)
    if (!check) return check

    let parentCommand
    if (typeof subCommand.parentCommand === 'string') {
      parentCommand = this.commands.find(c => c.name === subCommand.parentCommand)
    } else if (Array.isArray(subCommand.parentCommand)) {
      parentCommand = subCommand.parentCommand.reduce((o, ca) => {
        const arr = (Array.isArray(o) && o) || (o && o.subcommands)
        if (!arr) return
        return arr.find(c => c.name === ca)
      }, this.commands)
    }

    if (parentCommand) {
      parentCommand.subcommands.push(subCommand)
      subCommand.parentCommand = parentCommand
    } else {
      parentCommand = subCommand.parentCommand
      const name = (Array.isArray(parentCommand) ? parentCommand : [ parentCommand ]).concat([ subCommand.name ]).join(' ')
      this.client.logger.warn(`${name} failed to load`, { reason: 'Couldn\'t find parent command', label: this.constructor.name })
      return false
    }

    return check
  }

  checkCommand (command) {
    if (!(command instanceof Command)) {
      this.client.logger.warn(`${command.constructor.name} failed to load`, { reason: 'Not a Command', label: this.constructor.name })
      return false
    }

    if (command.canLoad() !== true) {
      this.client.logger.warn(`${command.fullName} failed to load`, { reason: command.canLoad() || 'canLoad function did not return true', label: this.constructor.name })
      return false
    }

    if (command.requirements) {
      if (command.requirements.apis && !command.requirements.apis.every(api => {
        if (!this.client.apis[api]) this.client.logger.warn(`${command.fullName} failed to load`, { reason: `Required API wrapper "${api}" not found`, label: this.constructor.name })
        return !!this.client.apis[api]
      })) return false

      if (command.requirements.envVars && !command.requirements.envVars.every(variable => {
        if (!process.env[variable]) this.client.logger.warn(`${command.fullName} failed to load`, { reason: `Required environment variable "${variable}" is not set`, label: this.constructor.name })
        return !!process.env[variable]
      })) return false

      if (command.requirements.canvasOnly && !this.client.canvasLoaded) {
        this.client.logger.warn(`${command.fullName} failed to load`, { reason: 'Canvas is required but not installed', label: this.constructor.name })
        return false
      }
    }

    return true
  }
}
