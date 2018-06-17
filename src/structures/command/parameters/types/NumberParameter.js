const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const isNull = (n) => n === null || n === undefined || isNaN(n)

module.exports = class NumberParameter extends Parameter {
  constructor (options = {}) {
    super(options)

    this.min = Number(options.min)
    this.max = Number(options.max)
  }

  parse (arg) {
    if (!arg) return

    let nmb = Number(arg)
    if (isNull(nmb)) {
      return new CommandError('You need to give me a valid number!')
    }

    if (!isNull(this.min)) nmb = Math.max(nmb, this.min)
    if (!isNull(this.max)) nmb = Math.min(nmb, this.max)
    return nmb
  }
}
