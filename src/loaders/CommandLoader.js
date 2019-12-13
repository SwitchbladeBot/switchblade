const { Loader, Command, FileUtils } = require('../')

module.exports = class CommandLoader extends Loader {
  constructor (client) {
    super({
      critical: true
    }, client)

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
    if (typeof command.parent === 'string' || Array.isArray(command.parent)) {
      this.posLoadCommands.push(command)
    } else {
      const check = this.checkCommand(command)
      if (!check) return check
      this.commands.push(command)
    }

    return true
  }

  addSubcommand (subCommand) {
    let parent
    if (typeof subCommand.parent === 'string') {
      parent = this.commands.find(c => c.name === subCommand.parent)
    } else if (Array.isArray(subCommand.parent)) {
      parent = subCommand.parent.reduce((o, ca) => {
        const arr = (Array.isArray(o) && o) || (o && o.subcommands)
        if (!arr) return
        return arr.find(c => c.name === ca)
      }, this.commands)
    }

    if (parent) {
      parent.subcommands.push(subCommand)
      subCommand.parent = parent
      if (subCommand.category === 'general') subCommand.category = parent.category
    } else {
      parent = subCommand.parent
      const name = (Array.isArray(parent) ? parent : [ parent ]).concat([ subCommand.name ]).join(' ')
      this.log(`[31m${name} failed to load - Couldn't find parent command.`, 'Commands')
      return false
    }

    const check = this.checkCommand(subCommand)
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
