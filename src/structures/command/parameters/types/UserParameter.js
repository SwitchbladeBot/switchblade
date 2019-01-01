const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')
const PermissionUtils = require('../../../../utils/PermissionUtils.js')

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/

module.exports = class UserParameter extends Parameter {
  constructor (options = {}) {
    options = Object.assign({
      acceptBot: false,
      acceptUser: true,
      acceptDeveloper: true,
      acceptSelf: false
    }, options)

    super(options)
    this.acceptBot = !!options.acceptBot
    this.acceptUser = !!options.acceptUser
    this.acceptDeveloper = !!options.acceptDeveloper
    this.acceptSelf = !!options.acceptSelf

    this.errors = Object.assign({
      invalidUser: 'errors:invalidUser',
      acceptSelf: 'errors:sameUser',
      acceptBot: 'errors:invalidUserBot',
      acceptUser: 'errors:invalidUserNotBot',
      acceptDeveloper: 'errors:userCantBeDeveloper'
    }, options.errors)
  }

  parse (arg, context) {
    if (!arg) return

    const regexResult = MENTION_REGEX.exec(arg)
    let userId = regexResult && regexResult[1]
    return this.user(context, userId)
  }

  user ({ t, client, author }, id) {
    const user = client.users.get(id)
    if (!user) return new CommandError(t(this.errors.invalidUser))
    if (!this.acceptSelf && id === author.id) return new CommandError(t(this.errors.acceptSelf))
    if (!this.acceptBot && user.bot) return new CommandError(t(this.errors.acceptBot))
    if (!this.acceptUser && !user.bot) return new CommandError(t(this.errors.acceptUser))
    if (!this.acceptDeveloper && PermissionUtils.isDeveloper(client, user)) return new CommandError(t(this.errors.acceptDeveloper), false)
    return user
  }
}
