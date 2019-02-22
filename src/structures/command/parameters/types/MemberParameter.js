const UserParameter = require('./UserParameter.js')

module.exports = class MemberParameter extends UserParameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      fetchUser: false
    }
  }

  static parse (arg, context) {
    if (!arg) return

    const { guild } = context
    const user = super.parse(arg, context)
    return guild.member(user)
  }
}
