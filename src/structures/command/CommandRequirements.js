const CommandError = require('./CommandError.js')

module.exports = class CommandRequirements {
  constructor (command, options = {}) {
    this.command = command
    this.cooldownMap = new Map()

    this.permissions = options.permissions || []

    this.cooldown = Object.assign({enabled: false, feedback: true, time: 1}, options.cooldown)

    this.devOnly = !!options.devOnly
    this.guildOnly = !!options.guildOnly
    this.nsfwOnly = !!options.nsfwOnly
    this.voiceChannelOnly = !!options.voiceChannelOnly
    this.guildPlaying = !!options.guildPlaying
  }

  handle ({ t, author, channel, client, guild, member, voiceChannel }, args) {
    if (this.devOnly) {
      const botGuild = client.guilds.get(process.env.BOT_GUILD)
      const developerRole = botGuild && botGuild.roles.get(process.env.DEVELOPER_ROLE)
      const hasRole = developerRole && developerRole.members.has(author.id)
      if (!hasRole) {
        return new CommandError(t('errors:developerOnly'))
      }
    }

    if (this.guildOnly && !guild) {
      return new CommandError(t('errors:guildOnly'))
    }

    if (this.nsfwOnly && guild && !channel.nsfw) {
      return new CommandError(t('errors:nsfwOnly'))
    }

    if (this.voiceChannelOnly && !voiceChannel) {
      return new CommandError(t('errors:voiceChannelOnly'))
    }

    const guildPlayer = client.playerManager.get(guild.id)
    if (this.guildPlaying && (!guildPlayer || !guildPlayer.playing)) {
      return new CommandError(t('errors:notPlaying'))
    }

    if (this.permissions.length > 0) {
      if (!channel.permissionsFor(member).has(this.permissions)) {
        const permission = this.permissions.map(p => t(`permissions:${p}`)).map(p => `**"${p}"**`).join(', ')
        const sentence = this.permissions.length > 1 ? 'errors:missingOnePermission' : 'errors:missingMultiplePermissions'
        return new CommandError(t(sentence, { permission }))
      }
    }

    if (this.cooldown.enabled && this.cooldownMap.has(author.id)) {
      if (this.cooldown.feedback) {
        return new CommandError(t('errors:cooldown'))
      }
    }
  }

  applyCooldown (user, time) {
    if (!user || !this.cooldown.enabled) return false
    time = time || this.cooldown.time

    if (!this.cooldownMap.has(user.id)) {
      this.cooldownMap.set(user.id, Date.now())
      user.client.setTimeout(() => {
        this.cooldownMap.delete(user.id)
      }, time * 1000)
    }
  }
}
