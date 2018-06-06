const Parameter = require('./Parameter.js')
const ParameterError = require('./ParameterError.js')

module.exports = class NumberParameter extends Parameter {
  constructor (options = {}) {
    super(options)

    this.min = Number(options.min)
    this.max = Number(options.max)
  }

  parse (arg) {
    let nmb = Number(arg)
    if (isNaN(nmb)) {
      return new ParameterError('You need to give me a valid number!')
    }

    if (this.min) nmb = Math.max(nmb, this.min)
    if (this.max) nmb = Math.min(nmb, this.max)
    return nmb
  }
}
