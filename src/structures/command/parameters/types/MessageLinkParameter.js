const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const MESSAGE_LINK = /https?:\/\/(?:canary\.)*discord(?:app)*.com\/channels\/([0-9]{16,18})\/([0-9]{16,18})\/([0-9]{16,18})/
function returnProperties (modifiers, regexResult) {
  const Result = []
  const ifIncludes = ['link', 'guild', 'channel', 'message']

  for (let i = 0; i < ifIncludes.length; i++) {
    if (modifiers.includes(ifIncludes[i])) {
      Result.push(regexResult[i])
    }
  }

  return Result
}

/**
 * @param  {String} userID - The id of the user who should have permission checked.
 * @param  {Object} channel - The channel from the message.
 * @param  {Array<String>} permissions - An Array with discord permissions.
 * @Param  {Function} t - The translate function.
 * @param  {String} blameWho - Who to blame if the permission is missing.
 * @returns {String}
 */
const ensurePermissions = (userID, channel, permissions, t, blameWho) => {
  for (let i = 0; i < permissions.length; i++) {
    const permission = permissions[i]
    if (!channel.permissionsFor(userID).has(permission)) {
      return t(blameWho === 'bot' ? 'errors:iDontHavePermission' : 'errors:youDontHavePermissionToRead', { permission })
    }
  }

  return null
}

module.exports = class MessageLinkParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      sameGuildOnly: !!options.sameGuildOnly,
      sameChannelOnly: !!options.sameChannelOnly,
      returnModifier: options.returnModifier ? options.returnModifier : ['link', 'guild', 'channel', 'message'],
      forceExists: !!options.forceExists,
      returnRegexResult: !!options.returnRegexResult,
      linkChannelUserPermission: options.linkChannelUserPermission,
      linkChannelBotPermission: options.linkChannelBotPermission
    }
  }

  static async parse (arg, { t, client, guild, author, channel }) {
    const regexResult = MESSAGE_LINK.exec(arg)
    if (regexResult) {
      const [, guildId, channelId, messageId] = regexResult

      if (this.sameGuildOnly && guildId !== guild.id) throw new CommandError(t('errors:messageNotFromSameGuild'))

      if (this.sameChannelOnly && channelId !== channel.id) throw new CommandError(t('errors:messageNotFromSameChannel'))

      if (this.forceExists) {
        const guild = client.guilds.cache.get(guildId)
        if (!guild) throw new CommandError(t('errors:validLinkButNotInGuild'))

        const channel = guild.channels.cache.get(channelId)
        if (!channel) throw new CommandError(t('errors:validLinkButGhostChannel'))

        const recievedMessage = await channel.messages.fetch(messageId)
        if (!recievedMessage) throw new CommandError(t('errors:validLinkButGhostMessage'))

        if (this.linkChannelBotPermission) {
          const result = ensurePermissions(client.user.id, recievedMessage.channel, this.linkChannelBotPermission, t, 'bot')

          if (result) throw new CommandError(result)
        }

        if (this.linkChannelUserPermission) {
          const result = ensurePermissions(author.id, recievedMessage.channel, this.linkChannelUserPermission, t, 'user')

          if (result) throw new CommandError(result)
        }

        if (this.returnRegexResult) return regexResult

        return recievedMessage
      }
      return returnProperties(this.returnModifier, regexResult)
    }
    throw new CommandError(t('errors:invalidMessageLink'), this.showUsage)
  }
}
