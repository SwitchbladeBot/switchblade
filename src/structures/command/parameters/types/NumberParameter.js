const Parameter = require('./Parameter.js')
const CommandError = require('../../CommandError.js')

const isNull = (n) => n === null || n === undefined || isNaN(n)

module.exports = class NumberParameter extends Parameter {
  constructor (options = {}) {
    super(options)

    this.min = Number(options.min)
    this.max = Number(options.max)
    this.forceMin = !!options.forceMin
    this.forceMax = !!options.forceMax
  }

  parse (arg, { t }) {
    if (!arg) return

    let nmb = Number(arg)
    if (isNull(nmb)) throw new CommandError(t('errors:invalidNumber'))
    if (!isNull(this.min) && nmb < this.min) {
      if (!this.forceMin) throw new CommandError(t('errors:needBiggerNumber', { number: this.min }))
      nmb = this.min
    }
    if (!isNull(this.max) && nmb > this.max) {
      if (!this.forceMax) throw new CommandError(t('errors:needSmallerNumber', { number: this.max }))
      nmb = this.max
    }

    return nmb
  }
}
