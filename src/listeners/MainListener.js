const { CommandContext, EventListener } = require('../')
const { SwitchbladePlayerManager } = require('../music')

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['ready', 'message']
  }

  onReady () {
    this.user.setPresence({ game: { name: `@${this.user.username} help` } })

    // Lavalink connection
    const lavalinkRequiredVariables = ['LAVALINK_HOST', 'LAVALINK_PORT', 'LAVALINK_PASSWORD']
    if (lavalinkRequiredVariables.every(variable => !!process.env[variable])) {
      const nodes = [{
        'host': process.env.LAVALINK_HOST,
        'port': process.env.LAVALINK_PORT || '1337',
        'password': process.env.LAVALINK_PASSWORD || 'password'
      }]
      this.playerManager = new SwitchbladePlayerManager(this, nodes, {
        user: this.user.id,
        shards: 1
      })
      this.log('[32mLavalink connection established!', 'Music')
    } else {
      this.log(`[31mFailed to establish Lavalink connection - Required environment variable(s) (${lavalinkRequiredVariables.filter(variable => !process.env[variable]).join(', ')}) not set.`, 'Music')
    }

    // TODO: Make stat posters modular
    async function postStats (client) {
      let success = 0
      let failed = 0
      await Promise.all(
        client.botlists.map(async l => {
          try {
            await l.postStatistics({
              id: client.user.id,
              shardId: 0,
              shardCount: 1,
              serverCount: client.guilds.size,
              userCount: client.users.size,
              voiceConnections: client.voiceConnections.size
            })
            success++
          } catch (e) {
            client.log(`[31mFailed to post statistics to ${l.name}`, 'Bot Lists')
            failed++
          }
        })
      )
      client.log(failed ? `[33mPosted statistics to ${success} bot lists, ${failed} failed.` : `[32mPosted statistics to all ${success} bot lists without errors.`, 'Bot Lists')
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
      const fullCmd = message.content.substring(usedPrefix.length).split(/\s+/g).filter(a => a).map(s => s.trim())
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
