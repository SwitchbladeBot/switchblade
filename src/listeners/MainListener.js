const { CommandContext, EventListener } = require('../')
const { SwitchbladePlayerManager } = require('../music')

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['ready', 'message', 'guildCreate', 'guildDelete']
  }

  onReady () {
    this.user.setPresence({game: {name: `@${this.user.username} help`}})

    // Lavalink connection
    const nodes = [{
      'host': process.env.LAVALINK_WSS_HOST,
      'port': process.env.LAVALINK_WSS_PORT,
      'password': process.env.LAVALINK_PASSWORD
    }]
    this.playerManager = new SwitchbladePlayerManager(this, nodes, {
      user: this.user.id,
      shards: 1
    })
  }

  onGuildCreate (guild) {
    this.log(`Joined guild ${guild.name} (${guild.id}) with ${guild.members.size} members`, 'Guilds')
  }

  onGuildDelete (guild) {
    this.log(`Left guild ${guild.name} (${guild.id}) with ${guild.members.size} members`, 'Guilds')
  }

  async onMessage (message) {
    if (message.author.bot) return

    const guildDocument = message.guild && this.database && await this.database.guilds.get(message.guild.id)
    const prefix = (guildDocument && guildDocument.prefix) || process.env.PREFIX
    const prefixRegex = new RegExp(`^(<@[!]?${this.user.id}>[ ]?|${prefix}).+`)
    const regexResult = prefixRegex.exec(message.content)
    if (regexResult) {
      const usedPrefix = regexResult[1]
      const fullCmd = message.content.substring(usedPrefix.length).split(/\s+/g).filter(a => a).map(s => s.trim())
      const args = fullCmd.slice(1)
      const cmd = fullCmd[0].toLowerCase().trim()
      const command = this.commands.find(c => c.name.toLowerCase() === cmd || c.aliases.includes(cmd))

      if (command) {
        const language = (guildDocument && guildDocument.language) || 'en-US'
        const context = new CommandContext({
          prefix: usedPrefix,
          aliase: cmd,
          client: this,
          message,
          command,
          guildDocument,
          language
        })
        this.runCommand(command, context, args, language)
        this.log(`Command ${command.name} with ${args.toString() ? `args ${args.join(' ')}` : 'no args'} was executed on ${message.guild.name} by ${message.author.tag} `, 'Commands')
      }
    }
  }
}
