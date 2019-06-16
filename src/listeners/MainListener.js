const { CommandContext, EventListener, MiscUtils } = require('../')
const { SwitchbladePlayerManager } = require('../music')
const fetch = require('node-fetch')

const PRESENCE_INTERVAL = 60 * 1000 // 1 minute

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['ready', 'message', 'voiceStateUpdate']
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
      this.logger.debug(`Presence changed to "${presence.name}"`, { label: 'Presence', presence })
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
        this.logger.info('Connection established', { label: 'Lavalink' })
      } catch (e) {
        this.logger.warn('Failed to establish connection', { label: 'Lavalink', reason: 'Failed to parse LAVALINK_NODES environment variable.' })
      }
    }

    // TODO: Make stat posters modular
    function postStats (client) {
      // bots.discord.pw
      if (process.env.DISCORDBOTSPW_TOKEN) {
        const body = { server_count: client.guilds.size }
        this.logger.debug('Posting statistics to bots.discord.pw', { label: 'BotLists', botList: 'bots.discord.pw', body })
        fetch(`https://bots.discord.pw/api/bots/${client.user.id}/stats`, {
          method: 'POST',
          headers: { Authorization: process.env.DISCORDBOTSPW_TOKEN },
          body
        }).catch(e => this.logger.warn('Failed to post statistics to bots.discord.pw', { label: 'BotLists', botList: 'bots.discord.pw', body }))
      }

      // discordbots.org
      if (process.env.DBL_TOKEN) {
        const body = { server_count: client.guilds.size }
        this.logger.debug('Posting statistics to discordbots.org', { label: 'BotLists', botList: 'discordbots.org', body })
        fetch(`https://discordbots.org/api/bots/${client.user.id}/stats`, {
          method: 'POST',
          headers: { Authorization: process.env.DBL_TOKEN },
          body
        }).catch(e => this.logger.warn('Failed to post statistics to discordbots.org', { label: 'BotLists', botList: 'discordbots.org', body }))
      }

      // botsfordiscord.com
      if (process.env.BOTSFORDISCORD_TOKEN) {
        const body = { server_count: client.guilds.size }
        this.logger.debug('Posting statistics to botsfordiscord.com', { label: 'BotLists', botList: 'botsfordiscord.com', body })
        fetch(`https://botsfordiscord.com/api/bots/${client.user.id}`, {
          method: 'POST',
          headers: { Authorization: process.env.BOTSFORDISCORD_TOKEN },
          body
        }).catch(e => this.logger.warn('Failed to post statistics to botsfordiscord.com', { label: 'BotLists', botList: 'botsfordiscord.com', body }))
      }

      // discordbotlist.com
      if (process.env.DBL2_TOKEN) {
        const body = { guilds: client.guilds.size, users: client.users.size }
        this.logger.debug('Posting statistics to discordbotlist.com', { label: 'BotLists', botList: 'discordbotlist.com', body })
        fetch(`https://discordbotlist.com/api/bots/${client.user.id}/stats`, {
          method: 'POST',
          headers: { Authorization: process.env.DBL2_TOKEN },
          body
        }).catch(e => this.logger.warn('Failed to post statistics to discordbotlist.com', { label: 'BotLists', botList: 'discordbotlist.com', body }))
      }
    }

    postStats(this)
    setInterval(postStats, 1800000, this)
  }

  async onMessage (message) {
    if (message.author.bot) return

    const guildId = message.guild && message.guild.id
    const { prefix, language } = await this.modules.configuration.retrieve(guildId, 'prefix language')

    const botMention = this.user.toString()

    const sw = (...s) => s.some(st => message.content.startsWith(st))
    const usedPrefix = sw(botMention, `<@!${this.user.id}>`) ? `${botMention} ` : sw(prefix) ? prefix : null

    if (usedPrefix) {
      const fullCmd = message.content.substring(usedPrefix.length).split(/[ \t]+/).filter(a => a)
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

        const contextForLogging = {
          channel: {
            name: message.channel.name,
            id: message.channel.id
          },
          guild: {
            name: message.guild.name,
            id: message.guild.id,
            prefix,
            language
          },
          executor: {
            name: message.author.tag,
            id: message.author.id
          },
          command: {
            name: command.constructor.name,
            alise: cmd
          },
          message: {
            content: message.content,
            id: message.id
          }
        }
        this.logger.info(`"${message.content}" ran by "${message.author.tag}"`, {
          label: 'Commands',
          commandRun: contextForLogging
        })
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
