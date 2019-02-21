const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

module.exports = class GuildParameter extends Parameter {
  static parse (arg, { t, client }) {
    if (!arg) return
    const guild = client.guilds.get(arg)
    if (!guild) throw new CommandError(t('errors:invalidGuild'))
    return guild
  }
}
