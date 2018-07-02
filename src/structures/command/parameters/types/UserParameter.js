const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/

module.exports = class UserParameter extends Parameter {
  constructor (options = {}) {
    options = Object.assign({acceptBot: false, acceptUser: true}, options)
    super(options)
    this.acceptBot = !!options.acceptBot
    this.acceptUser = !!options.acceptUser
  }

  parse (arg, context) {
    if (!arg) return

    const regexResult = MENTION_REGEX.exec(arg)
    let userId = regexResult && regexResult[1]
    return this.user(context, userId)
  }

  user ({ t, client }, id) {
    const user = client.users.get(id)
    if (!user) return new CommandError(t('errors:invalidUser'))
    if (!this.acceptBot && user.bot) return new CommandError(t('errors:invalidUserBot'))
    if (!this.acceptUser && !user.bot) return new CommandError(t('errors:invalidUserNotBot'))
    return user
  }
}
