const { Command } = require('../../')

module.exports = class WelcomeTranslator extends Command {
  constructor (client) {
    super(client, {
      name: 'welcometranslator',
      category: 'developers',
      hidden: true,
      requirements: { managersOnly: true },
      parameters: [{
        type: 'user',
        acceptSelf: false,
        missingError: 'commands:welcometranslator.noMember',
        errors: { acceptSelf: 'commands:welcometranslator.cantWelcomeYourself' }
      }]
    })
  }

  run ({ t, guild, member: author, channel }, member) {
    channel.startTyping()
    channel.send(t('commands:welcometranslator.welcomeMessage', { member })).then(() => channel.stopTyping())
  }
}
