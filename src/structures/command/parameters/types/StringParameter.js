const Parameter = require('./Parameter.js')
const DiscordUtils = require('../../../../utils/DiscordUtils.js')

module.exports = class StringParameter extends Parameter {
  constructor (options = {}) {
    super(options)
    this.clean = !!options.clean
  }

  parse (arg, { message }) {
    arg = arg ? (typeof arg === 'string' ? arg : String(arg)) : undefined
    return arg && this.clean ? DiscordUtils.cleanContent(arg, message) : arg
  }
}
