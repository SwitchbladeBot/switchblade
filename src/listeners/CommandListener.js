const { EventListener } = require('../')

module.exports = class CommandListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['message']
  }

  onMessage (message) {
    if (message.author.bot) {
      return
    }

    const prefix = process.env.PREFIX
    if (message.content.startsWith(prefix)) {
      let fullCmd = message.content.split(/\s+/g).filter(a => a).map(s => s.trim())
      let args = fullCmd.slice(1)
      let cmd = fullCmd[0].substring(prefix.length).toLowerCase()
      let command = this.commands.find(c => c.name.toLowerCase() === cmd || c.aliases.includes(cmd))

      if (command) {
        this.runCommand(command, message, args)
      }
    }
  }
}
