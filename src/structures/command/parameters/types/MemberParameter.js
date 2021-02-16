const UserParameter = require('./UserParameter.js')
const CommandError = require('../../CommandError.js')
const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

module.exports = class MemberParameter extends UserParameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      /**
       * Returns undefined if it's not a member object but user.
       */
      userPartial: defVal(options, 'userPartial', false),
      errors: {
        userPartial: 'errors:userPartial',
        ...(options.errors || {})
      }
    }
  }

  static async parse (arg, context) {
    if (!arg) return

    // const { guild } = context
    const user = await super.parse(arg, context)
    const { t } = context

    if (!user) return undefined

    if (user.user) {
      return user
    }

    console.log(this.userPartial)
    if (!this.userPartial && !user.user) throw new CommandError(t(this.errors.userPartial))

    return user
  }
}
