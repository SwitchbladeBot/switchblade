const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const isNull = (n) => n === null || n === undefined || isNaN(n)

module.exports = class NumberParameter extends Parameter {
  constructor (options = {}) {
    super(options)

    this.min = Number(options.min)
    this.max = Number(options.max)
  }

  parse (arg, { t }) {
    if (!arg) return

    let nmb = Number(arg)
    if (isNull(nmb)) {
      throw new CommandError(t('errors:invalidNumber'))
    }

    if (!isNull(this.min) && nmb < this.min) throw new CommandError(t('errors:needBiggerNumber', { number: this.min }))
    if (!isNull(this.max) && nmb > this.max) throw new CommandError(t('errors:needSmallerNumber', { number: this.max }))

    return nmb
  }
}
