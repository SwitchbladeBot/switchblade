const { Module, PlaceholderUtils, PlaceholderRules } = require('../')

const Joi = require('joi')

const MAX_MESSAGE_SIZE = 250
const PLACEHOLDER_BLACKLIST = ['channel', 'channelName']

module.exports = class JoinLockModule extends Module {
  constructor (client) {
    super({
      name: 'joinLock',
      displayName: 'Join Lock',
      defaultState: false,
      defaultValues: { message: '' },
      specialInput: {
        message: { max: MAX_MESSAGE_SIZE },
        placeholders: PlaceholderRules.filter(r => !PLACEHOLDER_BLACKLIST.includes(r.name))
      }
    }, client)
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
