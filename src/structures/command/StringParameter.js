const Parameter = require('./Parameter.js')

module.exports = class StringParameter extends Parameter {
  constructor (options = {}) {
    super(options)
  }

  parse (arg, error) {
    return arg && (typeof arg === 'string' ? arg : String(arg))
  }
}
