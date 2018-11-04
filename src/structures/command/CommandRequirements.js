const CommandError = require('./CommandError.js')
const PermissionUtils = require('../../utils/PermissionUtils.js')
const moment = require('moment')

module.exports = class CommandRequirements {
  constructor (command, options = {}) {
    this.command = command
    this.cooldownMap = new Map()

    this.permissions = options.permissions || []

    this.botPermissions = options.botPermissions || []

    this.cooldown = Object.assign({ enabled: false, feedback: true, time: 1 }, options.cooldown)

    this.devOnly = !!options.devOnly
    this.guildOnly = !!options.guildOnly
    this.onlyOldAccounts = !!options.onlyOldAccounts
    this.nsfwOnly = !!options.nsfwOnly

    this.sameVoiceChannelOnly = !!options.sameVoiceChannelOnly
    this.voiceChannelOnly = !!options.voiceChannelOnly
    this.guildPlaying = !!options.guildPlaying

    this.databaseOnly = !!options.databaseOnly
    this.playerManagerOnly = this.guildPlaying || !!options.playerManagerOnly

    this.errors = Object.assign({
      databaseOnly: 'errors:databaseOnly',
      playerManagerOnly: 'errors:playerManagerOnly',
      devOnly: 'errors:developerOnly',
      guildOnly: 'errors:guildOnly',
      nsfwOnly: 'errors:nsfwOnly',
      sameVoiceChannelOnly: 'errors:sameVoiceChannelOnly',
      voiceChannelOnly: 'errors:voiceChannelOnly',
      guildPlaying: 'errors:notPlaying',
      cooldown: 'errors:cooldown',
      onlyOldAccounts: 'errors:onlyOldAccounts'
    }, options.errors)
  }

  handle ({ t, author, channel, client, guild, member, voiceChannel }, args) {
    if (this.databaseOnly && !client.database) {
      return new CommandError(t(this.errors.databaseOnly))
    }

    if (this.playerManagerOnly && !client.playerManager) {
      return new CommandError(t(this.errors.playerManagerOnly))
    }

    if (this.devOnly && !PermissionUtils.isDeveloper(client, author)) {
      return new CommandError(t(this.errors.devOnly))
    }

    if (this.guildOnly && !guild) {
      return new CommandError(t(this.errors.guildOnly))
    }

    if (this.nsfwOnly && guild && !channel.nsfw) {
      return new CommandError(t(this.errors.nsfwOnly))
    }

    if (this.sameVoiceChannelOnly && guild.me.voiceChannelID && (!voiceChannel || guild.me.voiceChannelID !== voiceChannel.id)) {
      return new CommandError(t(this.errors.sameVoiceChannelOnly))
    }

    if (this.voiceChannelOnly && !voiceChannel) {
      return new CommandError(t(this.errors.voiceChannelOnly))
    }

    if (this.onlyOldAccounts && moment(author.createdTimestamp).format('MM, YYYY') === moment().format('MM, YYYY')) {
      return new CommandError(t(this.errors.onlyOldAccounts))
    }

    const guildPlayer = client.playerManager && client.playerManager.get(guild.id)
    if (this.guildPlaying && (!guildPlayer || !guildPlayer.playing)) {
      return new CommandError(t(this.errors.guildPlaying))
    }

    if (this.permissions.length > 0) {
      if (!channel.permissionsFor(member).has(this.permissions)) {
        const permission = this.permissions.map(p => t(`permissions:${p}`)).map(p => `**"${p}"**`).join(', ')
        const sentence = this.permissions.length >= 1 ? 'errors:missingOnePermission' : 'errors:missingMultiplePermissions'
        return new CommandError(t(sentence, { permission }))
      }
    }

    if (this.botPermissions.length > 0) {
      if (!channel.permissionsFor(guild.me).has(this.permissions)) {
        const permission = this.botPermissions.map(p => t(`permissions:${p}`)).map(p => `**"${p}"**`).join(', ')
        const sentence = this.botPermissions.length >= 1 ? 'errors:botMissingOnePermission' : 'errors:botMissingMultiplePermissions'
        return new CommandError(t(sentence, { permission }))
      }
    }

    if (this.cooldown.enabled && this.cooldownMap.has(author.id)) {
      if (this.cooldown.feedback) {
        return new CommandError(t(this.errors.cooldown))
      }
    }
  }

  applyCooldown (user, time = this.cooldown.time) {
    if (!user || !this.cooldown.enabled) return false
    if (!this.cooldownMap.has(user.id)) {
      this.cooldownMap.set(user.id, Date.now())
      user.client.setTimeout(() => this.cooldownMap.delete(user.id), time * 1000)
    }
  }
}
