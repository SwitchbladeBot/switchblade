module.exports = class Field {
  constructor (module, options) {
    this.module = module
    this.type = options.type
    this.key = options.key
    this.displayName = options.displayName // Temporary until website localization
    this.defaultValue = options.defaultValue
  }

  get defaultState () {
    return { value: this.defaultValue }
  }

  asJSON (data) {
    return {
      key: this.key,
      displayName: this.displayName,
      type: this.type,
      value: this.parseValue(data.value)
    }
  }

  parseValue (value) {
    return value
  }

  get valueVerification () {
    return
  }
}
