const Parameter = require('./Parameter')
const CommandError = require('../../CommandError')

const MENTION_REGEX = /(<#)?([0-9]{16,18})>?$/
const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

const searchOn = (local, id, arg) => (
  local.channels.cache.get(id) || local.channels.cache.find(c => c.name.toLowerCase().includes(arg.toLowerCase()))
)

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
      return t(blameWho === 'bot' ? 'errors:iDontHavePermission' : 'errors:youDontHavePermissionToRead', { permission } )
    }
  }

  return null
}

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
      acceptStore: defVal(options, 'acceptStore', false),
      channelUserPermission: defVal(options, 'channelUserPermission', false),
      channelBotPermission: defVal(options, 'channelBotPermission', false)
    }
  }

  static parse (arg, { t, author, client, guild }) {
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

    if (this.channelBotPermission) {
      const result = ensurePermissions(client.user.id, channel, this.channelBotPermission, t, 'bot')

      if (result) throw new CommandError(result)
    }

    if (this.channelUserPermission) {
      const result = ensurePermissions(author.id, channel, this.channelUserPermission, t, 'user')

      if (result) throw new CommandError(result)
    }

    return channel
  }
}
