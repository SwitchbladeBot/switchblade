const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const MENTION_ROLE_REGEX = /^(?:<@&?)?([0-9]{16,18})(?:>)?$/

module.exports = class RoleParameter extends Parameter {
  static parse (arg, { t, guild }) {
    if (!arg) return

    const regexResult = MENTION_ROLE_REGEX.exec(arg)
    const id = regexResult && regexResult[1]

    const role = guild.roles.cache.get(id) || guild.roles.cache.find(r => r.name.toLowerCase().includes(arg.toLowerCase()))
    if (!role) throw new CommandError(t('errors:invalidRole'))
    return role
  }
}
