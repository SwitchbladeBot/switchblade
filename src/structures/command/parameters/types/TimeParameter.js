const Parameter = require('./Parameter')
const CommandError = require('../../CommandError')
const ms = require('ms')

module.exports = class TimeParamenter extends Parameter {
  static parse (arg, { t }) {
    if (!arg) return

    const result = ms(arg)
    if (!result) throw new CommandError(t('errors:invalidTime'))
    return result
  }
}
