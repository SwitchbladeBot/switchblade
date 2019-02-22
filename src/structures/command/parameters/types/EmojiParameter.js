const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const EMOJI_REGEX = /^(?:<:)(.*?)(?::)([0-9]{18})(?:>)$/
const ANIMATED_REGEX = /^(?:<a:)(.*?)(?::)([0-9]{18})(?:>)$/

module.exports = class EmojiParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...options,
      sameGuildOnly: !!options.sameGuildOnly
    }
  }

  static parse (arg, { t, guild }) {
    const staticRegexResult = EMOJI_REGEX.exec(arg)
    const animatedRegexResult = ANIMATED_REGEX.exec(arg)
    const regexResult = staticRegexResult || animatedRegexResult

    let name = ''
    let id = ''
    let isAnimated = ''

    if (regexResult) {
      if (this.sameGuildOnly && !guild.emojis.get(regexResult[2])) throw new CommandError(t('errors:emojiNotFromSameGuild'))
      emojiName = regexResult[1]
      emojiId = regexResult[2]
      emojiIsAnimated = Boolean(animatedRegexResult)
    }

    if (!regexResult) {
      const emoji = guild.emojis.find('name', arg)
      if (!emoji) throw new CommandError(t('errors:invalidEmoji'))
      if (this.sameGuildOnly && !emoji) throw new CommandError(t('errors:emojiNotFromSameGuild'))
      name = emoji.name
      id = emoji.id
      emoji.isAnimated = emoji.animated
    }

    return { name, id, isAnimated, url: `https://cdn.discordapp.com/emojis/${id}.${isAnimated ? 'gif' : 'png'}` }
  }
}
