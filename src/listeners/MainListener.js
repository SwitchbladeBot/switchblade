const { CommandContext, EventListener, MiscUtils } = require('../')
const { SwitchbladePlayerManager } = require('../music')
const fetch = require('node-fetch')

const EmojiLoader = require('../loaders/EmojiLoader.js')

const PRESENCE_INTERVAL = 60 * 1000 // 1 minute

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super({
      events: ['ready', 'message', 'voiceStateUpdate']
    }, client)
  }

  onReady () {
    this.user.setPresence({ game: { name: `@${this.user.username} help` } })

    const presences = [
      {
        name: `${MiscUtils.formatNumber(this.guilds.size, 'en-US')} Guilds | @${this.user.username} help`,
        type: 'WATCHING'
      }, {
        name: `${MiscUtils.formatNumber(this.users.size, 'en-US')} Users | @${this.user.username} help`,
        type: 'WATCHING'
      }
    ]

    setInterval(() => {
      const presence = presences[Math.floor(Math.random() * presences.length)]
      this.user.setPresence({ game: presence })
    }, PRESENCE_INTERVAL)

    // Lavalink connection
    if (process.env.LAVALINK_NODES) {
      try {
        let nodes = JSON.parse(process.env.LAVALINK_NODES)
        if (!Array.isArray(nodes)) throw new Error('PARSE_ERROR')
        this.playerManager = new SwitchbladePlayerManager(this, nodes, {
          user: this.user.id,
          shards: 1
        })
        this.log('Lavalink connection established!', { color: 'green', tags: ['Music'] })
      } catch (e) {
        this.log(`Failed to establish Lavalink connection - Failed to parse LAVALINK_NODES environment variable.`, { color: 'red', tags: ['Music'] })
      }
    }

    // TODO: Make stat posters modular
    function postStats (client) {
      // bots.discord.pw
      if (process.env.DISCORDBOTSPW_TOKEN) {
        fetch(`https://bots.discord.pw/api/bots/${client.user.id}/stats`, {
          method: 'POST',
          headers: { Authorization: process.env.DISCORDBOTSPW_TOKEN },
          body: { server_count: client.guilds.size }
        })
          .then(() => client.log('Posted statistics successfully', { color: 'green', tags: ['bots.discord.pw'] }))
          .catch(() => client.log('Failed to post statistics', { color: 'red', tags: ['bots.discord.pw'] }))
      }

      // discordbots.org
      if (process.env.DBL_TOKEN) {
        fetch(`https://discordbots.org/api/bots/${client.user.id}/stats`, {
          method: 'POST',
          headers: { Authorization: process.env.DBL_TOKEN },
          body: { server_count: client.guilds.size }
        })
          .then(() => client.log('Posted statistics successfully', { color: 'green', tags: ['discordbots.org'] }))
          .catch(() => client.log('Failed to post statistics', { color: 'red', tags: ['discordbots.org'] }))
      }

      // botsfordiscord.com
      if (process.env.BOTSFORDISCORD_TOKEN) {
        fetch(`https://botsfordiscord.com/api/bots/${client.user.id}`, {
          method: 'POST',
          headers: { Authorization: process.env.BOTSFORDISCORD_TOKEN },
          body: { server_count: client.guilds.size }
        })
          .then(() => client.log('Posted statistics successfully', { color: 'green', tags: ['botsfordiscord.com'] }))
          .catch(() => client.log('Failed to post statistics', { color: 'red', tags: ['botsfordiscord.com'] }))
      }

      if (process.env.DBL2_TOKEN) {
        fetch(`https://discordbotlist.com/api/bots/${client.user.id}/stats`, {
          method: 'POST',
          headers: { Authorization: process.env.DBL2_TOKEN },
          body: { guilds: client.guilds.size, users: client.users.size }
        })
          .then(() => client.log('Posted statistics successfully', { color: 'green', tags: ['discordbotlist.com'] }))
          .catch(() => client.log('Failed to post statistics', { color: 'red', tags: ['discordbotlist.com'] }))
      }
    }

    postStats(this)
    setInterval(postStats, 1800000, this)

    const emojiLoader = new EmojiLoader(this)
    emojiLoader.load()
  }

  async onMessage (message) {
    if (message.author.bot) return

    const guildId = message.guild && message.guild.id

    const { prefix, spacePrefix } = await this.modules.prefix.retrieveValues(guildId, [ 'prefix', 'spacePrefix' ])
    const language = await this.modules.language.retrieveValue(guildId, 'language')

    const botMention = this.user.toString()

    const sw = (...s) => s.some(st => message.content.startsWith(st))
    const usedPrefix = sw(botMention, `<@!${this.user.id}>`) ? `${botMention} ` : sw(prefix) ? prefix : null

    if (usedPrefix) {
      const fullCmd = message.content.substring(usedPrefix.length).split(/[ \t]+/).filter(a => !spacePrefix || a)
      const args = fullCmd.slice(1)
      if (!fullCmd.length) return

      const cmd = fullCmd[0].toLowerCase().trim()
      const command = this.commands.find(c => c.name.toLowerCase() === cmd || (c.aliases && c.aliases.includes(cmd)))
      if (command) {
        const userDocument = this.database && await this.database.users.findOne(message.author.id, 'blacklisted')
        if (userDocument && userDocument.blacklisted) return

        const context = new CommandContext({
          defaultPrefix: usedPrefix,
          aliase: cmd,
          client: this,
          prefix,
          message,
          command,
          language
        })

        this.log(`"${message.content}" (${command.constructor.name}) ran by "${message.author.tag}" (${message.author.id}) on guild "${message.guild.name}" (${message.guild.id}) channel "#${message.channel.name}" (${message.channel.id})`, { color: 'magenta', tags: ['Commands'] })
        this.runCommand(command, context, args, language)
      }
    }
  }

  async onVoiceStateUpdate (oldMember, newMember) {
    if (!this.playerManager) return
    const guildPlayer = this.playerManager.get(newMember.guild.id)
    if (!guildPlayer) return
    guildPlayer.updateVoiceState(oldMember, newMember)
  }
}
