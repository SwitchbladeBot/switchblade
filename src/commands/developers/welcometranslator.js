const { CommandStructures } = require('../../')
const { Command, CommandParameters, CommandRequirements, UserParameter } = CommandStructures
module.exports = class welcometranslator extends Command {
  constructor (client) {
    super(client, {
      name: 'welcometranslator',
      category: 'developers',
      hidden: true,
      requirements: { managersOnly: true },
      parameters: [{
        type: 'user', missingError: 'commands:welcometranslator.noMember',
        acceptSelf: false, errors: { acceptSelf: 'commands:welcometranslator.cantWelcomeYourself' }
      }]
    })
  }

  run ({ t, guild, member: author, channel }, member) {
    channel.startTyping()
    channel.send(t('commands:welcometranslator.welcomeMessage', { member })).then(() => channel.stopTyping())
  }
}
