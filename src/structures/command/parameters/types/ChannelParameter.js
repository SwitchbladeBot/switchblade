const Parameter = require('./Parameter')
const CommandError = require('../../CommandError')

const MENTION_REGEX = /(<#)?([0-9]{16,18})>?$/
const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

const searchOn = (local, id, arg) => (
  local.channels.get(id) || local.channels.find(c => c.name.toLowerCase().includes(arg.toLowerCase()))
)

module.exports = class ChannelParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      acceptDM: defVal(options, 'acceptDM', false),
      acceptGroup: defVal(options, 'acceptGroup', false),

      onlySameGuild: defVal(options, 'onlySameGuild', true),
      acceptText: defVal(options, 'acceptText', false),
      acceptVoice: defVal(options, 'acceptVoice', false),
      acceptCategory: defVal(options, 'acceptCategory', false),
      acceptNews: defVal(options, 'acceptNews', false),
      acceptStore: defVal(options, 'acceptStore', false)
    }
  }

  static parse (arg, { t, client, guild }) {
    const check = (option, type) => {
      if (!option && channel.type === type) throw new CommandError(t('errors:invalidChannelType', { type }))
    }

    if (!arg) return

    const regexResult = MENTION_REGEX.exec(arg)
    const id = regexResult && regexResult[2]

    let channel = searchOn(guild, id, arg)
    if (!this.onlySameGuild) channel = channel || searchOn(client, id, arg)

    if (!channel) throw new CommandError(t('errors:invalidChannel'))

    check(this.acceptDM, 'dm')
    check(this.acceptGroup, 'group')
    check(this.acceptText, 'text')
    check(this.acceptVoice, 'voice')
    check(this.acceptCategory, 'category')
    check(this.acceptNews, 'news')
    check(this.acceptStore, 'store')

    return channel
  }
}
