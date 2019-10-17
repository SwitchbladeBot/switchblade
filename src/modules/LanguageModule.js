const { Module } = require('../')

const Joi = require('@hapi/joi')

// Language
module.exports = class LanguageModule extends Module {
  constructor (client) {
    super('language', client)
    this.displayName = 'Language'

    this.toggleable = false
    this.defaultValues = { language: 'en-US' }

    this.specialInput = { language: { whitelist: Object.keys(this.client.i18next.store.data) } }
  }

  validateValues (entity) {
    return Joi.object().keys({
      language: Joi.string().valid(...Object.keys(this.client.i18next.store.data))
    }).validate(entity)
  }
}
