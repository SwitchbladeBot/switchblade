const { CommandStructures } = require('../../')
const { Command, CommandParameters, CommandRequirements, UserParameter } = CommandStructures
module.exports = class welcometranslator extends Command {
  constructor (client) {
    super(client)
    this.name = 'welcometranslator'
    this.category = 'developers'
    this.hidden = true

    this.requirements = new CommandRequirements(this, { managersOnly: true })
    this.parameters = new CommandParameters(this,
      new UserParameter({ missingError: 'commands:welcometranslator.noMember', acceptSelf: false, errors: { acceptSelf: 'commands:welcometranslator.cantWelcomeYourself' } }))
  }

  run ({ t, guild, member: author, channel }, member) {
    channel.startTyping()
    channel.send(t('commands:welcometranslator.welcomeMessage', { member })).then(() => channel.stopTyping())
  }
}
