const { Module } = require('../')

const Joi = require('joi')

const MIN_PREFIX_SIZE = 1
const MAX_PREFIX_SIZE = 50

// Prefix
module.exports = class PrefixModule extends Module {
  constructor (client) {
    super('prefix', client)
    this.displayName = 'Prefix'

    this.toggleable = false
    this.defaultValues = {
      prefix: process.env.PREFIX,
      spacePrefix: true
    }

    this.specialInput = { prefix: { max: MAX_PREFIX_SIZE } }
  }

  validateValues (entity) {
    return Joi.validate(entity, Joi.object().keys({
      prefix: Joi.string().min(MIN_PREFIX_SIZE).max(MAX_PREFIX_SIZE).truncate(),
      spacePrefix: Joi.boolean()
    }))
  }
}
