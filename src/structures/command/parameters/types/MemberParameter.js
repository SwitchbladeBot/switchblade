const UserParameter = require('./UserParameter.js')

module.exports = class MemberParameter extends UserParameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options)
    }
  }

  static async parse (arg, context) {
    if (!arg) return

    const { guild } = context
    const user = await super.parse(arg, context)

    if (!user) return undefined
    return user.user ? user : (guild.members.cache.get(user.id) || user)
  }
}
