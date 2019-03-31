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
      this.logError(e)
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
    }, this.logError.bind(this)).then(() => {
      const sorted = this.posLoadCommands.sort((a, b) => +(typeof b === 'string') || -(typeof a === 'string') || a.length - b.length)
      sorted.forEach(subCommand => this.addSubcommand(subCommand))
      this.log(failed ? `[33m${success} commands loaded, ${failed} failed.` : `[32mAll ${success} commands loaded without errors.`, 'Commands')
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
      this.log(`[31m${name} failed to load - Couldn't find parent command.`, 'Commands')
      return false
    }

    return check
  }

  checkCommand (command) {
    if (!(command instanceof Command)) {
      this.log(`[31m${command} failed to load - Not a command`, 'Commands')
      return false
    }

    if (command.canLoad() !== true) {
      this.log(`[31m${command.fullName} failed to load - ${command.canLoad() || 'canLoad function did not return true.'}`, 'Commands')
      return false
    }

    if (command.requirements) {
      if (command.requirements.apis && !command.requirements.apis.every(api => {
        if (!this.client.apis[api]) this.log(`[31m${command.fullName} failed to load - Required API wrapper "${api}" not found.`, 'Commands')
        return !!this.client.apis[api]
      })) return false

      if (command.requirements.envVars && !command.requirements.envVars.every(variable => {
        if (!process.env[variable]) this.log(`[31m${command.fullName} failed to load - Required environment variable "${variable}" is not set.`, 'Commands')
        return !!process.env[variable]
      })) return false

      if (command.requirements.canvasOnly && !this.client.canvasLoaded) {
        this.log(`[31m${command.fullName} failed to load - Canvas is not installed.`, 'Commands')
        return false
      }
    }

    return true
  }
}
