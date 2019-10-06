const StringField = require('./StringField.js')
const Joi = require('joi')

module.exports = class StringDropdownField extends StringField {
  constructor (module, options) {
    super(module, options)
    this.values = options.values
  }

  asJSON (data) {
    return {
      ...super.asJSON(data),
      values: this.values
    }
  }

  get valueVerification () {
    return super.valueVerification.valid(this.values)
  }
}
