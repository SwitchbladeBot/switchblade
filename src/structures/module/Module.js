const Fields = require('./fields')
const Joi = require('joi')

const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

module.exports = class Module {
  constructor (client, options = {}) {
    this.client = client

    this.name = options.name
    this.displayName = options.displayName // Temporary until website localization

    this.toggleable = defVal(options, 'toggleable', true)
    this.configurable = defVal(options, 'configurable', true)
    
    this.fields = options.fields.map(f => new Fields[f.type](this, f))
  }

  // State
  async state (guild) {
    return this.client.controllers.module.fetch(guild, this).then(r => r || this.defaultState)
  }

  get defaultState () {
    return {
      enabled: false,
      fields: {}
    }
  }

  // Helpers
  async isEnabled (guild) {
    return this.state(guild).then(r => r.enabled)
  }

  async asJSON (guild) {
    const { name, displayName, toggleable, configurable } = this
    const { enabled, fields } = await this.state(guild)
    return {
      name,
      displayName,
      enabled,
      toggleable,
      configurable,
      fields: this.fields.map(f => {
        const fState = fields[f.key] || f.defaultState
        return f.asJSON(fState)
      })
    }
  }

  async fieldsVerification (entity) {
    const schema = Joi.object().keys(
      this.fields.reduce((o, f) => {
        o[f.key] = f.valueVerification
      }, {})
    )
    return Joi.validate(entity, schema)
  }
}
