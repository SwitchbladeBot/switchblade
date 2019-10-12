const { Module } = require('../')

const Joi = require('@hapi/joi')

const MAX_MESSAGE_SIZE = 250

// JoinLock
module.exports = class JoinLockModule extends Module {
  constructor (client) {
    super('joinLock', client)
    this.displayName = 'Join Lock'

    this.defaultState = false
    this.defaultValues = { message: '' }
    this.specialInput = { message: { max: MAX_MESSAGE_SIZE } }
  }

  validateValues (entity) {
    return Joi.object().keys({
      message: Joi.string().max(MAX_MESSAGE_SIZE).allow('').optional()
    }).validate(entity)
  }
}
