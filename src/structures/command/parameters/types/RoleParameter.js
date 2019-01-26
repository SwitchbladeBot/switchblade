const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const MENTION_ROLE_REGEX = /^(?:<@&?)?([0-9]{16,18})(?:>)?$/

module.exports = class RoleParameter extends Parameter {
  parse (arg, context) {
    if (!arg) return
    const regexResult = MENTION_ROLE_REGEX.exec(arg)
    if (regexResult) arg = regexResult[1]
    return this.role(context, arg)
  }

  role ({ t, guild }, arg) {
    const role = guild.roles.get(arg) || guild.roles.find(r => r.name.toLowerCase().includes(arg.toLowerCase()))
    if (!role) throw new CommandError(t('errors:invalidRole'))
    return role
  }
}
