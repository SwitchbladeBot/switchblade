const Parameter = require('./Parameter.js')

module.exports = class NumberParameter extends Parameter {
  constructor (options = {}) {
    super(options)

    this.min = Number(options.min)
    this.max = Number(options.max)
  }

  parse (arg, error) {
    let nmb = Number(arg)
    if (isNaN(nmb)) {
      error('You need to give me a valid number!')
      return null
    }

    if (this.min) nmb = Math.max(nmb, this.min)
    if (this.max) nmb = Math.min(nmb, this.max)
    return nmb
  }
}
