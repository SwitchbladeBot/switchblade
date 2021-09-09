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
    return FileUtils.requireDirectory(dirPath, (NewCommand, path) => {
      this.addCommand(new NewCommand(this.client), path) ? success++ : failed++
    }, this.logError.bind(this)).then(() => {
      const sorted = this.posLoadCommands.sort((a, b) => +(typeof b === 'string') || -(typeof a === 'string') || a.length - b.length)
      sorted.forEach(subCommand => this.addSubcommand(subCommand))
      if (failed) this.log(`${success} commands loaded, ${failed} failed.`, { color: 'yellow', tags: ['Commands'] })
      else this.log(`All ${success} commands loaded without errors.`, { color: 'green', tags: ['Commands'] })
    })
  }

  /**
   * Adds a new command to the Client.
   * @param {Command} command - Command to be added
   */
  addCommand (command, path) {
    command.path = path
    if (typeof command.parentCommand === 'string' || Array.isArray(command.parentCommand)) {
      this.posLoadCommands.push(command)
    } else {
      const check = this.checkCommand(command)
      if (!check) return check
      this.commands.push(command)
    }

    return true
  }

  addSubcommand (subCommand) {
    let parentCommand
    if (typeof subCommand.parentCommand === 'string') {
      parentCommand = this.commands.find(c => c.name === subCommand.parentCommand)
    } else if (Array.isArray(subCommand.parentCommand)) {
      parentCommand = subCommand.parentCommand.reduce((o, ca) => {
        const arr = (Array.isArray(o) && o) || (o && o.subcommands)
        if (!arr) return null
        return arr.find(c => c.name === ca)
      }, this.commands)
    }

    if (!parentCommand) {
      parentCommand = subCommand.parentCommand
      const name = (Array.isArray(parentCommand) ? parentCommand : [parentCommand]).concat([subCommand.name]).join(' ')
      this.log(`${name} failed to load - Couldn't find parent command.`, { color: 'red', tags: ['Commands'] })
      return false
    }

    const check = this.checkCommand(subCommand)
    if (check) {
      parentCommand.subcommands.push(subCommand)
      subCommand.parentCommand = parentCommand
      if (subCommand.category === 'general') subCommand.category = parentCommand.category
      return true
    }
    return false
  }

  checkCommand (command) {
    if (!(command instanceof Command)) {
      this.log(`${command} failed to load - Not a command`, { color: 'red', tags: ['Commands'] })
      return false
    }

    if (command.canLoad() !== true) {
      this.log(`${command.fullName} failed to load - ${command.canLoad() || 'canLoad function did not return true.'}`, { color: 'red', tags: ['Commands'] })
      return false
    }

    if (command.requirements) {
      if (command.requirements.apis && !command.requirements.apis.every(api => {
        if (!this.client.apis[api]) this.log(`${command.fullName} failed to load - Required API wrapper "${api}" not found.`, { color: 'red', tags: ['Commands'] })
        return !!this.client.apis[api]
      })) return false

      if (command.requirements.envVars && !command.requirements.envVars.every(variable => {
        if (!process.env[variable]) this.log(`${command.fullName} failed to load - Required environment variable "${variable}" is not set.`, { color: 'red', tags: ['Commands'] })
        return !!process.env[variable]
      })) return false

      if (command.requirements.canvasOnly && !this.client.canvasLoaded) {
        this.log(`${command.fullName} failed to load - Canvas is not installed.`, { color: 'red', tags: ['Commands'] })
        return false
      }
    }

    return true
  }
}
