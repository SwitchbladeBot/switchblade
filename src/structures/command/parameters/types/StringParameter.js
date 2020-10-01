const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')
const { cleanContent } = require('discord.js').Util

module.exports = class StringParameter extends Parameter {
  static parseOptions (options = {}) {
    return {
      ...super.parseOptions(options),
      clean: !!options.clean,
      maxLength: Number(options.maxLength) || 0,
      truncate: !!options.truncate,
      toUpperCase: !!options.toUpperCase,
      toLowerCase: !!options.toLowerCase
    }
  }

  static parse (arg, { t, message }) {
    arg = arg ? (typeof arg === 'string' ? arg : String(arg)) : undefined
    if (!arg) return

    if (this.clean) arg = cleanContent(arg, message)

    if (this.maxLength > 0 && arg.length > this.maxLength) {
      if (!this.truncate) throw new CommandError(t('errors:needSmallerString', { number: this.maxLength }))
      arg = arg.substring(0, this.maxLength)
    }

    if (this.toUpperCase) arg = arg.toUpperCase()
    if (this.toLowerCase) arg = arg.toLowerCase()

    return arg
  }
}
