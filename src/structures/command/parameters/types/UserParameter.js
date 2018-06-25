const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const MENTION_REGEX = /^(?:<@!?)?([0-9]{16,18})(?:>)?$/

module.exports = class UserParameter extends Parameter {
  constructor (options = {}) {
    super(options)
  }

  parse (arg, context) {
    if (!arg) return

    const regexResult = MENTION_REGEX.exec(arg)
    let userId = regexResult && regexResult[1]
    return this.user(context, userId)
  }

  user ({ t, client }, id) {
    return client.users.get(id) || new CommandError(t('errors:invalidUser'))
  }
}
