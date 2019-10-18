const { Module, PlaceholderUtils, PlaceholderRules } = require('../')

const Joi = require('@hapi/joi')

const MAX_MESSAGE_SIZE = 250
const PLACEHOLDER_BLACKLIST = [ 'channel', 'channelName' ]

// JoinLock
module.exports = class JoinLockModule extends Module {
  constructor (client) {
    super('joinLock', client)
    this.displayName = 'Join Lock'

    this.defaultState = false
    this.defaultValues = { message: '' }
    this.specialInput = {
      message: { max: MAX_MESSAGE_SIZE },
      placeholders: PlaceholderRules.filter(r => !PLACEHOLDER_BLACKLIST.includes(r.name))
    }
  }

  parseMessage (message, member) {
    return PlaceholderUtils.parse(message, {
      guild: member.guild,
      user: member.user
    }, null, PLACEHOLDER_BLACKLIST)
  }

  validateValues (entity) {
    return Joi.object().keys({
      message: Joi.string().max(MAX_MESSAGE_SIZE).allow('').optional().trim()
    }).validate(entity)
  }
}
