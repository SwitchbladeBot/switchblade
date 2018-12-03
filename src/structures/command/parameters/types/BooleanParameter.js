const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

module.exports = class StringParameter extends Parameter {
  constructor (options = {}) {
    super(options)
    this.trueValues = options.trueValues || ['true', 'yes', 'on']
    this.falseValues = options.falseValues || ['false', 'no', 'off']
  }

  parse (arg, { t }) {
    if (!this.trueValues.concat(this.falseValues).includes(arg)) return new CommandError(t('errors:notTrueOrFalse'))
    return this.trueValues.includes(arg)
  }
}
