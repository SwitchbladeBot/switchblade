const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const EMOJI_REGEX = /^<(a)?:(\w+):(\d{16,18})>$/

module.exports = class EmojiParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      sameGuildOnly: !!options.sameGuildOnly
    }
  }

  static parse (arg, { t, client, guild }) {
    const regexResult = EMOJI_REGEX.exec(arg)
    if (regexResult) {
      const [ ,,, id ] = regexResult
      const emoji = client.emojis.get(id)
      if (!emoji) throw new CommandError(t('errors:invalidEmoji'), this.showUsage)
      if (this.sameGuildOnly && emoji.guild.id !== guild.id) throw new CommandError(t('errors:emojiNotFromSameGuild'))
      return emoji
    }

    const emoji = (this.sameGuildOnly ? guild : client).emojis.find(e => e.name === arg)
    if (!emoji) throw new CommandError(t('errors:invalidEmoji'), this.showUsage)
    return emoji
  }
}
