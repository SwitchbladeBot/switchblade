const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

module.exports = class BooleanParameter extends Parameter {
  constructor (options = {}) {
    super(options)
    this.trueValues = options.trueValues || ['true', 'yes', 'on']
    this.falseValues = options.falseValues || ['false', 'no', 'off']
  }

  parse (arg, { t }) {
    if (!this.trueValues.concat(this.falseValues).includes(arg)) throw new CommandError(t('errors:notTrueOrFalse'))
    return this.trueValues.includes(arg)
  }
}
