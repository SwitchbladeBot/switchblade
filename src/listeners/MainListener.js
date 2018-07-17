const { CommandContext, EventListener } = require('../')
const { SwitchbladePlayerManager } = require('../music')
const snekfetch = require('snekfetch')

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['ready', 'message']
  }

  onReady () {
    this.user.setPresence({game: {name: `@${this.user.username} help`}})

    // Lavalink connection
    if (process.env.LAVALINK_WSS_HOST) {
      const nodes = [{
        'host': process.env.LAVALINK_WSS_HOST,
        'port': process.env.LAVALINK_WSS_PORT || '1337',
        'password': process.env.LAVALINK_PASSWORD || 'password'
      }]
      this.playerManager = new SwitchbladePlayerManager(this, nodes, {
        user: this.user.id,
        shards: 1
      })
      this.log('Player manager connection established!', 'Music')
    } else {
      this.log('Player manager connection didn\'t establish!', 'Music')
    }

    // TODO: Make stat posters modular
    function postStats (client) {
      // bots.discord.pw
      if (process.env.DISCORDBOTSPW_TOKEN) {
        snekfetch
          .post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
          .set('Authorization', process.env.DISCORDBOTSPW_TOKEN)
          .send({server_count: client.guilds.size})
          .then(() => client.log('Posted statistics successfully', 'bots.discord.pw'))
          .catch(() => client.log('Failed to post statistics', 'bots.discord.pw'))
      }

      // discordbots.org
      if (process.env.DBL_TOKEN) {
        snekfetch
          .post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
          .set('Authorization', process.env.DBL_TOKEN)
          .send({server_count: client.guilds.size})
          .then(() => client.log('Posted statistics successfully', 'discordbots.org'))
          .catch(() => client.log('Failed to post statistics', 'discordbots.org'))
      }

      // listcord.com
      if (process.env.LISTCORD_TOKEN) {
        snekfetch
          .post(`https://listcord.com/api/bot/${client.user.id}/guilds`)
          .set('Authorization', process.env.LISTCORD_TOKEN)
          .send({guilds: client.guilds.size})
          .then(() => client.log('Posted statistics successfully', 'listcord.com'))
          .catch(() => client.log('Failed to post statistics', 'listcord.com'))
      }

      // botsfordiscord.com
      if (process.env.BOTSFORDISCORD_TOKEN) {
        snekfetch
          .post(`https://botsfordiscord.com/api/v1/bots/${client.user.id}`)
          .set('Authorization', process.env.BOTSFORDISCORD_TOKEN)
          .send({guilds: client.guilds.size})
          .then(() => client.log('Posted statistics successfully', 'botsfordiscord.com'))
          .catch(() => client.log('Failed to post statistics', 'botsfordiscord.com'))
      }
    }

    postStats(this)
    setInterval(postStats, 1800000, this)
  }

  async onMessage (message) {
    if (message.author.bot) return
    const userDocument = this.database && await this.database.users.get(message.author.id)
    if (userDocument.blacklisted) return
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
          language,
          userDocument
        })
        this.log(`Command ${command.name} with ${args.length ? `args ${args.join(' ')}` : 'no args'} was executed on ${message.guild.name} by ${message.author.tag} `, 'Commands')
        this.runCommand(command, context, args, language)
      }
    }
  }
}
