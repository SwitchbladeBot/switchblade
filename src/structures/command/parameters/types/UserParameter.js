const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')
const PermissionUtils = require('../../../../utils/PermissionUtils.js')

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/

module.exports = class UserParameter extends Parameter {
  constructor (options = {}) {
    options = Object.assign({ acceptBot: false, acceptUser: true, acceptDeveloper: true, acceptSelf: false }, options)
    super(options)
    this.acceptBot = !!options.acceptBot
    this.acceptUser = !!options.acceptUser
    this.acceptDeveloper = !!options.acceptDeveloper
    this.self = !!options.acceptSelf
  }

  parse (arg, context) {
    if (!arg) return

    const regexResult = MENTION_REGEX.exec(arg)
    let userId = regexResult && regexResult[1]
    return this.user(context, userId)
  }

  user ({ t, client, author }, id) {
    const user = client.users.get(id)
    if (!user) return new CommandError(t('errors:invalidUser'))
    if (!this.self && id === author.id) return new CommandError(t('errors:sameUser'))
    if (!this.acceptBot && user.bot) return new CommandError(t('errors:invalidUserBot'))
    if (!this.acceptUser && !user.bot) return new CommandError(t('errors:invalidUserNotBot'))
    if (!this.acceptDeveloper && PermissionUtils.isDeveloper(client, user)) return new CommandError(t('errors:userCantBeDeveloper'), false)
    return user
  }
}
