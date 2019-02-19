const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const EMOJI_REGEX = /^(?:<:)(.*?)(?::)([0-9]{18})(?:>)$/
const ANIMATED_REGEX = /^(?:<a:)(.*?)(?::)([0-9]{18})(?:>)$/

module.exports = class EmojiParameter extends Parameter {
  constructor (options = {}) {
    options = Object.assign({ sameGuildOnly: false, acceptEmojiNames: true }, options)
    super(options)
    this.sameGuildOnly = !!options.sameGuildOnly
    this.acceptEmojiNames = !!options.acceptEmojiNames
  }

  parse (arg, { t, guild }) {
    const staticRegexResult = EMOJI_REGEX.exec(arg)
    const animatedRegexResult = ANIMATED_REGEX.exec(arg)
    const regexResult = staticRegexResult || animatedRegexResult

    let emojiName = ''
    let emojiId = ''
    let emojiIsAnimated = ''

    if (!this.acceptEmojiNames) {
      if (!regexResult) throw new CommandError(t('errors:invalidEmoji'))
      emojiName = regexResult[1]
      emojiId = regexResult[2]
      emojiIsAnimated = Boolean(animatedRegexResult)
    }

    if (this.acceptEmojiNames) {
      const emoji = guild.emojis.find('name', arg)
      if (!emoji) throw new CommandError(t('errors:invalidEmoji'))
      if (this.sameGuildOnly && !emoji) throw new CommandError(t('errors:emojiNotFromSameGuild'))
      emojiName = emoji.name
      emojiId = emoji.id
      emoji.isAnimated = emoji.animated
    }

    return this.emoji(emojiName, emojiId, emojiIsAnimated)
  }

  emoji (name, id, isAnimated) {
    return {
      name,
      id,
      isAnimated,
      url: `https://cdn.discordapp.com/emojis/${id}.${isAnimated ? 'gif' : 'png'}`
    }
  }
}
