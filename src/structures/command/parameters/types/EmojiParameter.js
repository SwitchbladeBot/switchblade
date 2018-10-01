const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const EMOJI_REGEX = /^(?:<:)(.*?)(?::)([0-9]{18})(?:>)$/

module.exports = class GuildParameter extends Parameter {
  parse (arg, { t }) {
    if (!arg) return
    const regexResult = EMOJI_REGEX.exec(arg)
    if (!regexResult) return new CommandError(t('errors:invalidEmoji'))
    return this.emoji(regexResult[1], regexResult[2])
  }
  emoji (name, id) {
    return {
      name,
      id,
      url: `https://cdn.discordapp.com/emojis/${id}.png`
    }
  }
}
