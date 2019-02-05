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
    this.openDms = !!options.openDms
    this.voiceChannelOnly = !!options.voiceChannelOnly
    this.guildPlaying = !!options.guildPlaying
    this.databaseOnly = !!options.databaseOnly
    this.playerManagerOnly = this.guildPlaying || !!options.playerManagerOnly
    this.apis = options.apis || []
    this.envVars = options.envVars || []
    this.managersOnly = options.managersOnly
    this.canvasOnly = options.canvasOnly

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
      onlyOldAccounts: 'errors:onlyOldAccounts',
      managersOnly: 'errors:managersOnly',
      openYourDms: 'errors:openYourDms'
    }, options.errors)
  }

  async handle ({ t, author, channel, client, guild, member, voiceChannel }, args) {
    if (this.databaseOnly && !client.database) {
      throw new CommandError(t(this.errors.databaseOnly))
    }

    if (this.playerManagerOnly && !client.playerManager) {
      throw new CommandError(t(this.errors.playerManagerOnly))
    }

    if (this.devOnly && !PermissionUtils.isDeveloper(client, author)) {
      throw new CommandError(t(this.errors.devOnly))
    }

    if (this.managersOnly && !PermissionUtils.isManager(client, author)) {
      throw new CommandError(t(this.errors.managersOnly))
    }

    if (this.guildOnly && !guild) {
      throw new CommandError(t(this.errors.guildOnly))
    }

    if (this.nsfwOnly && guild && !channel.nsfw) {
      throw new CommandError(t(this.errors.nsfwOnly))
    }

    if (this.sameVoiceChannelOnly && guild.me.voiceChannelID && (!voiceChannel || guild.me.voiceChannelID !== voiceChannel.id)) {
      throw new CommandError(t(this.errors.sameVoiceChannelOnly))
    }

    if (this.voiceChannelOnly && !voiceChannel) {
      throw new CommandError(t(this.errors.voiceChannelOnly))
    }

    if (this.onlyOldAccounts && moment(author.createdTimestamp).format('MM, YYYY') === moment().format('MM, YYYY')) {
      throw new CommandError(t(this.errors.onlyOldAccounts))
    }

    const guildPlayer = client.playerManager && client.playerManager.get(guild.id)
    if (this.guildPlaying && (!guildPlayer || !guildPlayer.playing)) {
      throw new CommandError(t(this.errors.guildPlaying))
    }

    if (this.permissions.length > 0) {
      if (!channel.permissionsFor(member).has(this.permissions)) {
        const permission = this.permissions.map(p => t(`permissions:${p}`)).map(p => `**"${p}"**`).join(', ')
        const sentence = this.permissions.length >= 1 ? 'errors:missingOnePermission' : 'errors:missingMultiplePermissions'
        throw new CommandError(t(sentence, { permission }))
      }
    }

    if (this.openDms) {
      try {
        await author.send()
      } catch (e) {
        if (e.code === 50007) throw new CommandError(t(this.errors.openYourDms))
      }
    }

    if (this.botPermissions.length > 0) {
      if (!channel.permissionsFor(guild.me).has(this.permissions)) {
        const permission = this.botPermissions.map(p => t(`permissions:${p}`)).map(p => `**"${p}"**`).join(', ')
        const sentence = this.botPermissions.length >= 1 ? 'errors:botMissingOnePermission' : 'errors:botMissingMultiplePermissions'
        throw new CommandError(t(sentence, { permission }))
      }
    }

    if (this.cooldown.enabled && this.cooldownMap.has(author.id)) {
      if (this.cooldown.feedback) {
        throw new CommandError(t(this.errors.cooldown))
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
