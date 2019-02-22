const CommandError = require('./CommandError.js')
const PermissionUtils = require('../../utils/PermissionUtils.js')
const moment = require('moment')

module.exports = class CommandRequirements {
  static parseOptions (options = {}) {
    return {
      permissions: options.permissions,
      botPermissions: options.botPermissions,

      guildOnly: !!options.guildOnly,
      nsfwOnly: !!options.nsfwOnly,
      databaseOnly: !!options.databaseOnly,
      sameVoiceChannelOnly: !!options.sameVoiceChannelOnly,
      voiceChannelOnly: !!options.voiceChannelOnly,
      guildPlaying: !!options.guildPlaying,
      playerManagerOnly: !!options.guildPlaying || !!options.playerManagerOnly,

      onlyOldAccounts: !!options.onlyOldAccounts,
      managersOnly: !!options.managersOnly,
      devOnly: !!options.devOnly,

      canvasOnly: options.canvasOnly,
      apis: options.apis || [],
      envVars: options.envVars || [],

      errors: {
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
        ...(options.errors || {})
      }
    }
  }

  static handle ({ t, author, channel, client, command, guild, member, voiceChannel }, options) {
    const opts = this.parseOptions(options)

    if (opts.databaseOnly && !client.database) {
      throw new CommandError(t(opts.errors.databaseOnly))
    }

    if (opts.playerManagerOnly && !client.playerManager) {
      throw new CommandError(t(opts.errors.playerManagerOnly))
    }

    if (opts.devOnly && !PermissionUtils.isDeveloper(client, author)) {
      throw new CommandError(t(opts.errors.devOnly))
    }

    if (opts.managersOnly && !PermissionUtils.isManager(client, author)) {
      throw new CommandError(t(opts.errors.managersOnly))
    }

    if (opts.guildOnly && !guild) {
      throw new CommandError(t(opts.errors.guildOnly))
    }

    if (opts.nsfwOnly && guild && !channel.nsfw) {
      throw new CommandError(t(opts.errors.nsfwOnly))
    }

    if (opts.sameVoiceChannelOnly && guild.me.voiceChannelID && (!voiceChannel || guild.me.voiceChannelID !== voiceChannel.id)) {
      throw new CommandError(t(opts.errors.sameVoiceChannelOnly))
    }

    if (opts.voiceChannelOnly && !voiceChannel) {
      throw new CommandError(t(opts.errors.voiceChannelOnly))
    }

    if (opts.onlyOldAccounts && moment().isSame(author.createdTimestamp, 'month')) {
      throw new CommandError(t(opts.errors.onlyOldAccounts))
    }

    const guildPlayer = client.playerManager && client.playerManager.get(guild.id)
    if (opts.guildPlaying && (!guildPlayer || !guildPlayer.playing)) {
      throw new CommandError(t(opts.errors.guildPlaying))
    }

    if (opts.permissions && opts.permissions.length > 0) {
      if (!channel.permissionsFor(member).has(opts.permissions)) {
        const permission = opts.permissions.map(p => t(`permissions:${p}`)).map(p => `**"${p}"**`).join(', ')
        const sentence = opts.permissions.length >= 1 ? 'errors:missingOnePermission' : 'errors:missingMultiplePermissions'
        throw new CommandError(t(sentence, { permission }))
      }
    }

    if (opts.botPermissions && opts.botPermissions.length > 0) {
      if (!channel.permissionsFor(guild.me).has(opts.permissions)) {
        const permission = opts.botPermissions.map(p => t(`permissions:${p}`)).map(p => `**"${p}"**`).join(', ')
        const sentence = opts.botPermissions.length >= 1 ? 'errors:botMissingOnePermission' : 'errors:botMissingMultiplePermissions'
        throw new CommandError(t(sentence, { permission }))
      }
    }

    if (command.cooldownTime > 0 && command.cooldownMap.has(author.id)) {
      if (command.cooldownFeedback) {
        throw new CommandError(t(opts.errors.cooldown))
      }
    }
  }
}
