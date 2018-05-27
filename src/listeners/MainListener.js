const { EventListener } = require('../')

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['ready', 'message']
  }

  onReady () {
    this.user.setPresence({game: {name: process.env.PREFIX + 'help'}})
  }

  async onMessage (message) {
    if (message.author.bot) return
    
    const guildDB = message.guild && this.database && await this.database.guilds.get(message.guild.id)
    const prefix = (guildDB && guildDB.prefix) || process.env.PREFIX
    const prefixRegex = new RegExp(`^(${this.user}[ ]?|${prefix}).+`)
    const prefixUsed = prefixRegex.exec(message.content)[1]
    if (prefixUsed) {
      const fullCmd = message.content.substring(prefixUsed.length).split(/\s+/g).filter(a => a).map(s => s.trim())
      const args = fullCmd.slice(1)
      const cmd = fullCmd[0].toLowerCase().trim()
      const command = this.commands.find(c => c.name.toLowerCase() === cmd || c.aliases.includes(cmd))

      if (command) {
        this.runCommand(command, message, args)
      }
    }
  }
}
