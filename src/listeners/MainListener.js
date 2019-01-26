const { CommandContext, EventListener } = require('../')
const { SwitchbladePlayerManager } = require('../music')
const snekfetch = require('snekfetch')

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['ready', 'message']
  }

  onReady () {
    this.user.setPresence({ game: { name: `@${this.user.username} help` } })

    // Lavalink connection
    if (process.env.LAVALINK_NODES) {
      try {
        let nodes = JSON.parse(process.env.LAVALINK_NODES)
        if (!Array.isArray(nodes)) throw new Error('PARSE_ERROR')
        this.playerManager = new SwitchbladePlayerManager(this, nodes, {
          user: this.user.id,
          shards: 1
        })
        this.log('[32mLavalink connection established!', 'Music')
      } catch (e) {
        this.log(`[31mFailed to establish Lavalink connection - Failed to parse LAVALINK_NODES environment variable.`, 'Music')
      }
    }

    // TODO: Make stat posters modular
    function postStats (client) {
      // bots.discord.pw
      if (process.env.DISCORDBOTSPW_TOKEN) {
        snekfetch
          .post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
          .set('Authorization', process.env.DISCORDBOTSPW_TOKEN)
          .send({ server_count: client.guilds.size })
          .then(() => client.log('[32mPosted statistics successfully', 'bots.discord.pw'))
          .catch(() => client.log('[31mFailed to post statistics', 'bots.discord.pw'))
      }

      // discordbots.org
      if (process.env.DBL_TOKEN) {
        snekfetch
          .post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
          .set('Authorization', process.env.DBL_TOKEN)
          .send({ server_count: client.guilds.size })
          .then(() => client.log('[32mPosted statistics successfully', 'discordbots.org'))
          .catch(() => client.log('[31mFailed to post statistics', 'discordbots.org'))
      }

      // botsfordiscord.com
      if (process.env.BOTSFORDISCORD_TOKEN) {
        snekfetch
          .post(`https://botsfordiscord.com/api/bots/${client.user.id}`)
          .set('Authorization', process.env.BOTSFORDISCORD_TOKEN)
          .send({ server_count: client.guilds.size })
          .then(() => client.log('[32mPosted statistics successfully', 'botsfordiscord.com'))
          .catch(() => client.log('[31mFailed to post statistics', 'botsfordiscord.com'))
      }

      if (process.env.DBL2_TOKEN) {
        snekfetch
          .post(`https://discordbotlist.com/api/bots/${client.user.id}/stats`)
          .set('Authorization', `Bot ${process.env.DBL2_TOKEN}`)
          .send({
            guilds: client.guilds.size,
            users: client.users.size
          })
          .then(() => client.log('[32mPosted statistics successfully', 'discordbotlist.com'))
          .catch(() => client.log('[31mFailed to post statistics', 'discordbotlist.com'))
      }
    }

    postStats(this)
    setInterval(postStats, 1800000, this)
  }

  async onMessage (message) {
    if (message.author.bot) return

    const guildDocument = message.guild && this.database && await this.database.guilds.findOne(message.guild.id, 'prefix language')
    const prefix = (guildDocument && guildDocument.prefix) || process.env.PREFIX

    const botMention = this.user.toString()
    const usedPrefix = message.content.startsWith(botMention) ? `${botMention} ` : message.content.startsWith(prefix) ? prefix : null

    if (usedPrefix) {
      const fullCmd = message.content.substring(usedPrefix.length).split(/[ \t]+/).filter(a => a)
      const args = fullCmd.slice(1)
      const cmd = fullCmd[0].toLowerCase().trim()

      const command = this.commands.find(c => c.name.toLowerCase() === cmd || c.aliases.includes(cmd))
      if (command) {
        const userDocument = this.database && await this.database.users.findOne(message.author.id, 'blacklisted')
        if (userDocument && userDocument.blacklisted) return

        const language = (guildDocument && guildDocument.language) || 'en-US'
        const context = new CommandContext({
          prefix: usedPrefix,
          defaultPrefix: prefix,
          aliase: cmd,
          client: this,
          message,
          command,
          language
        })

        this.log(`[35m"${message.content}" (${command.constructor.name}) ran by "${message.author.tag}" (${message.author.id}) on guild "${message.guild.name}" (${message.guild.id}) channel "#${message.channel.name}" (${message.channel.id})`, 'Commands')
        this.runCommand(command, context, args, language)
      }
    }
  }
}
