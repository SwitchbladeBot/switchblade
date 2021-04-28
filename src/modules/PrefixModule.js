const { Module } = require('../')

const Joi = require('joi')

const MIN_PREFIX_SIZE = 1
const MAX_PREFIX_SIZE = 50

module.exports = class PrefixModule extends Module {
  constructor (client) {
    super({
      name: 'prefix',
      displayName: 'Prefix',
      toggleable: false,
      defaultValues: {
        prefix: process.env.PREFIX,
        spacePrefix: true
      },
      specialInput: {
        prefix: { max: MAX_PREFIX_SIZE }
      }
    }, client)
  }

  validateValues (entity) {
    return Joi.object().keys({
      prefix: Joi.string().min(MIN_PREFIX_SIZE).max(MAX_PREFIX_SIZE).trim().truncate(),
      spacePrefix: Joi.boolean()
    }).validate(entity)
  }
}
