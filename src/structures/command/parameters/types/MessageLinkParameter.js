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

module.exports = class MessageLinkParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      sameGuildOnly: !!options.sameGuildOnly,
      sameChannelOnly: !!options.sameChannelOnly,
      returnModifier: options.returnModifier ? options.returnModifier : ['link', 'guild', 'channel', 'message'],
      forceExists: !!options.forceExists,
      returnRegexResult: !!options.returnRegexResult
    }
  }

  static async parse (arg, { t, client, guild, channel }) {
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

        try {
          const recievedMessage = await channel.messages.fetch(messageId)
          if (!recievedMessage) throw new CommandError(t('errors:validLinkButGhostMessage'))

          if (this.returnRegexResult) {
            return regexResult
          }

          return recievedMessage
        } catch (e) {
          throw new CommandError(t('errors:validLinkButGhostMessage'))
        }
      }
      return returnProperties(this.returnModifier, regexResult)
    }
    throw new CommandError(t('errors:invalidMessageLink'), this.showUsage)
  }
}
