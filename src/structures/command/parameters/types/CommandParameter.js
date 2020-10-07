const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]
const quoteRegex = (text) => text.replace(/([[\]^$|()\\+*?{}=!.])/gi, '\\$1')
const prefixRegex = (prefix) => new RegExp(`^${quoteRegex(prefix)}`)

module.exports = class CommandParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      acceptHidden: defVal(options, 'acceptHidden', false)
    }
  }

  static parse (arg, { t, client, prefix }) {
    if (!arg) return

    const validCommands = this.acceptHidden ? client.commands : client.commands.filter(c => !c.hidden)

    arg = arg.replace(prefixRegex(prefix), '')

    const command = arg.split(' ').reduce((o, ca) => {
      const arr = (Array.isArray(o) && o) || (o && o.subcommands)
      if (!arr) return o
      return arr.find(c => c.name === ca || (c.aliases && c.aliases.includes(ca)))
    }, validCommands)

    if (!command) throw new CommandError(t('errors:commandNotFound'))

    return command
  }
}
