const Field = require('./Field.js')
const Joi = require('joi')

module.exports = class StringField extends Field {
  constructor (module, options) {
    super(module, options)
    this.minLength = Number(options.minLength)
    this.maxLength = Number(options.maxLength)
  }

  asJSON (data) {
    return {
      ...super.asJSON(data),
      minLength: this.minLength,
      maxLength: this.maxLength
    }
  }

  get valueVerification () {
    const str = Joi.string()
    if (this.minLength) str.min(this.minLength)
    if (this.maxLength) str.max(this.maxLength)
    return str
  }
}
