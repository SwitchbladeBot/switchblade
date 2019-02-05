const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const MENTION_CHANNEL_REGEX = /^(?:<#?)?([0-9]{16,18})(?:>)?$/

module.exports = class ChannelParameter extends Parameter {
  constructor (options = {}) {
    options = Object.assign({ onlyTextChannels: true }, options)
    super(options)
    this.onlyTextChannels = !!options.onlyTextChannels
  }
  parse (arg, context) {
    if (!arg) return
    const regexResult = MENTION_CHANNEL_REGEX.exec(arg)
    if (regexResult) arg = regexResult[1]
    return this.channel(context, arg)
  }

  channel ({ t, guild }, arg) {
    const channel = guild.channels.get(arg) || guild.channels.find(r => r.name.toLowerCase().includes(arg.toLowerCase()))
    if (!channel) throw new CommandError(t('errors:invalidChannel'))
    if (this.onlyTextChannels && channel.type !== 'text') throw new CommandError(t('errors:onlyTextChannels'))
    return channel
  }
}
