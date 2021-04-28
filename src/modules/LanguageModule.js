const { Module } = require('../')

const Joi = require('joi')

// Language
module.exports = class LanguageModule extends Module {
  constructor (client) {
    super({
      name: 'language',
      displayName: 'Language',
      toggleable: false,
      defaultValues: { language: 'en-US' },
      specialInput: {
        language: { whitelist: Object.keys(client.i18next.store.data) }
      }
    }, client)
  }

  validateValues (entity) {
    return Joi.object().keys({
      language: Joi.string().valid(...Object.keys(this.client.i18next.store.data))
    }).validate(entity)
  }
}
