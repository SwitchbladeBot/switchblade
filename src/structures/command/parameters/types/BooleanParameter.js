const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

module.exports = class BooleanParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      trueValues: options.trueValues || ['true', 'yes', 'on'],
      falseValues: options.falseValues || ['false', 'no', 'off']
    }
  }

  static parse (arg, { t }) {
    if (!this.trueValues.concat(this.falseValues).includes(arg)) throw new CommandError(t('errors:notTrueOrFalse'))
    return this.trueValues.includes(arg)
  }
}
