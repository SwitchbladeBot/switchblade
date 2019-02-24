const Parameter = require('./Parameter.js')

module.exports = class BooleanFlagParameter extends Parameter {
  static parse () {
    return true
  }
}
