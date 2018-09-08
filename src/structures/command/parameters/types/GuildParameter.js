const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

module.exports = class GuildParameter extends Parameter {
  parse (arg, context) {
    if (!arg) return
    return this.guild(context, arg)
  }

  guild ({ t, client }, id) {
    const guild = client.guilds.get(id)
    if (!guild) return new CommandError(t('errors:invalidGuild'))
    return guild
  }
}
