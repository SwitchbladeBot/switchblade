const { CommandContext, EventListener, MiscUtils } = require('../')
const { SwitchbladePlayerManager } = require('../music')
const fetch = require('node-fetch')

const EmojiLoader = require('../loaders/EmojiLoader.js')

const PRESENCE_INTERVAL = 60 * 1000 // 1 minute

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super({
      events: ['ready', 'interactionCreate']
    }, client)
  }

  onReady () {
    this.user.setActivity(`@${this.user.username} help`, { type: 'PLAYING' })

    async function updatePresence (client) {
      const shardGuildCounts = await client.shard.fetchClientValues('guilds.cache.size')
      const totalGuildCount = shardGuildCounts.reduce((total, current) => total + current)
      const shardUserCounts = await client.shard.fetchClientValues('users.cache.size')
      const totalUserCount = shardUserCounts.reduce((total, current) => total + current)

      const presences = [
        {
          name: `${MiscUtils.formatNumber(totalGuildCount, 'en-US')} servers | @${client.user.username} help`,
          type: 'WATCHING'
        }, {
          name: `${MiscUtils.formatNumber(totalUserCount, 'en-US')} users | @${client.user.username} help`,
          type: 'WATCHING'
        }, {
          name: `Shard ${client.shard.ids.toString()} | @${client.user.username} help`,
          type: 'PLAYING'
        }, {
          name: `${MiscUtils.formatNumber(client.commands.length, 'en-US')} commands | @${client.user.username} help`,
          type: 'PLAYING'
        }
      ]

      const presence = presences[Math.floor(Math.random() * presences.length)]
      client.user.setActivity(presence.name, { type: presence.type })
    }

    setInterval(() => {
      updatePresence(this)
    }, PRESENCE_INTERVAL, this)

    // Lavalink connection
    if (process.env.LAVALINK_NODES) {
      try {
        const nodes = JSON.parse(process.env.LAVALINK_NODES)
        if (!Array.isArray(nodes)) throw new Error('PARSE_ERROR')
        this.playerManager = new SwitchbladePlayerManager(this, nodes, {
          user: this.user.id,
          shards: 1
        })
        this.playerManager.connect()
          .then(() => this.logger.info({ tag: 'Music' }, 'Lavalink connection established!'))
          .catch(() => this.logger.error({ tag: 'Music' }, 'Failed to establish Lavalink connection - Failed to connect to nodes.'))
      } catch (e) {
        this.logger.error({ tag: 'Music' }, 'Failed to establish Lavalink connection - Failed to parse LAVALINK_NODES environment variable.')
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
          .then(() => client.logger.info({ tags: ['bots.discord.pw'] }, 'Posted statistics successfully'))
          .catch(() => client.logger.error({ tags: ['bots.discord.pw'] }, 'Failed to post statistics'))
      }

      // discordbots.org
      if (process.env.DBL_TOKEN) {
        fetch(`https://top.gg/api/bots/${client.user.id}/stats`, {
          method: 'POST',
          headers: { Authorization: process.env.DBL_TOKEN },
          body: { server_count: client.guilds.size }
        })
          .then(() => client.logger.info('Posted statistics successfully', { tags: ['discordbots.org'] }))
          .catch(() => client.logger.error('Failed to post statistics', { tags: ['discordbots.org'] }))
      }

      // botsfordiscord.com
      if (process.env.BOTSFORDISCORD_TOKEN) {
        fetch(`https://botsfordiscord.com/api/bots/${client.user.id}`, {
          method: 'POST',
          headers: { Authorization: process.env.BOTSFORDISCORD_TOKEN },
          body: { server_count: client.guilds.size }
        })
          .then(() => client.logger.info('Posted statistics successfully', { tags: ['botsfordiscord.com'] }))
          .catch(() => client.logger.error('Failed to post statistics', { tags: ['botsfordiscord.com'] }))
      }

      if (process.env.DBL2_TOKEN) {
        fetch(`https://discordbotlist.com/api/bots/${client.user.id}/stats`, {
          method: 'POST',
          headers: { Authorization: process.env.DBL2_TOKEN },
          body: { guilds: client.guilds.size, users: client.users.size }
        })
          .then(() => client.logger.info('Posted statistics successfully', { tags: ['discordbotlist.com'] }))
          .catch(() => client.logger.error('Failed to post statistics', { tags: ['discordbotlist.com'] }))
      }
    }

    postStats(this)
    setInterval(postStats, 1800000, this)

    const emojiLoader = new EmojiLoader(this)
    emojiLoader.load()
  }

  async onInteractionCreate (interaction) {
    if (!interaction.isCommand() || !interaction.member) return
    const cmd = interaction.commandName
    const command = this.commands.find(c => c.name.toLowerCase() === cmd || (c.aliases && c.aliases.includes(cmd)))
    if (command) {
      const userDocument = this.database && await this.database.users.findOne(interaction.user.id, 'blacklisted')
      if (userDocument && userDocument.blacklisted) return
      let args = interaction.options._hoistedOptions.map(z => z.value)
      if (interaction.options._subcommand) args = [interaction.options._subcommand, ...args]
      args = args.map(z => z.toString?.() ?? z)

      const context = new CommandContext({
        client: this,
        interaction,
        command,
        language: interaction.locale,
        args
      })

      this.logger.info({ tag: 'Commands' }, `"(${command.constructor.name}) ran by "${interaction.user.tag}" (${interaction.user.id})`)
      this.runCommand(command, context, args, interaction.locale)
    }
  }
}
