const Parameter = require('./Parameter.js')

module.exports = class BooleanFlagParameter extends Parameter {
  constructor (options = {}) {
    super(options)
  }

  parse () {
    return true
  }
}
