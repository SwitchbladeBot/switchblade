const Parameter = require('./Parameter.js')
const DiscordUtils = require('../../../../utils/DiscordUtils.js')
const CommandError = require('../../CommandError.js')

module.exports = class StringParameter extends Parameter {
  constructor (options = {}) {
    super(options)
    this.clean = !!options.clean

    this.maxLength = 0
    this.truncate = true
  }

  parse (arg, { t, message }) {
    arg = arg ? (typeof arg === 'string' ? arg : String(arg)) : undefined
    if (!arg) return

    if (this.clean) arg = DiscordUtils.cleanContent(arg, message)

    if (this.maxLength > 0) {
      if (!this.truncate) throw new CommandError(t('errors:needSmallerString', { number: this.maxLength }))
      arg = arg.substring(0, this.maxLength)
    }

    return arg
  }
}
