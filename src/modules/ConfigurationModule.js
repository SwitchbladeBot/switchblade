const { Module } = require('../')

const Joi = require('joi')

// Configuration
module.exports = class ConfigurationModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'configuration'
  }

  canLoad () {
    return !!this.client.database
  }

  get _guilds () {
    return this.client.database.guilds
  }

  retrieve (_guild, projection = 'prefix language') {
    return this._guilds.findOne(_guild, projection)
  }

  validateConfiguration (entity) {
    return Joi.validate(entity, Joi.object().keys({
      prefix: Joi.string().min(1).max(50).truncate(),
      language: Joi.string().valid(Object.keys(this.client.i18next.store.data))
    }))
  }

  update (_guild, entity) {
    return this.validateConfiguration(entity).then(() => this._guilds.update(_guild, entity))
  }

  async setPrefix (_guild, prefix) {
    await this.update(_guild, { prefix })
  }

  async setLanguage (_guild, language) {
    await this.update(_guild, { language })
  }
}
