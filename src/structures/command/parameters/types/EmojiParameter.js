const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const EMOJI_REGEX = /^(?:<:)(.*?)(?::)([0-9]{18})(?:>)$/
const ANIMATED_REGEX = /^(?:<a:)(.*?)(?::)([0-9]{18})(?:>)$/

module.exports = class GuildParameter extends Parameter {
  parse (arg, { t }) {
    if (!arg) return
    const staticRegexResult = EMOJI_REGEX.exec(arg)
    const animatedRegexResult = ANIMATED_REGEX.exec(arg)
    const regexResult = staticRegexResult || animatedRegexResult
    if (!regexResult) return new CommandError(t('errors:invalidEmoji'))
    return this.emoji(regexResult[1], regexResult[2], Boolean(animatedRegexResult))
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
