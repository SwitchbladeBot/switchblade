const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')
const { ensurePermissions } = require('../../../../utils/DiscordUtils')

const MESSAGE_LINK = /https?:\/\/(?:(?:canary|ptb|development)\.)*discord(?:app)*.com\/channels\/(?<guild>[0-9]{16,18})\/(?<channel>[0-9]{16,18})\/(?<message>[0-9]{16,18})/

module.exports = class MessageLinkParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      sameGuildOnly: !!options.sameGuildOnly,
      sameChannelOnly: !!options.sameChannelOnly,
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

        const receivedMessage = await channel.messages.fetch(messageId).catch(() => null)
        if (!receivedMessage) throw new CommandError(t('errors:validLinkButGhostMessage'))

        if (this.linkChannelBotPermission) {
          const result = ensurePermissions(client.user.id, receivedMessage.channel, this.linkChannelBotPermission, t, 'bot')
          if (result) throw new CommandError(result)
        }

        if (this.linkChannelUserPermission) {
          const result = ensurePermissions(author.id, receivedMessage.channel, this.linkChannelUserPermission, t, 'user')
          if (result) throw new CommandError(result)
        }

        if (this.returnRegexResult) return regexResult

        return receivedMessage
      }

      const { guild: regexGuild, channel: regexChannel, message } = regexResult.pop()
      return {
        link: regexResult[0],
        guild: regexGuild,
        channel: regexChannel,
        message
      }
    }
    throw new CommandError(t('errors:invalidMessageLink'), this.showUsage)
  }
}
