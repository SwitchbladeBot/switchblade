const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Personaltext extends Command {
  constructor (client) {
    super(client)
    this.name = 'personaltext'
    this.aliases = ['profiletext']
    this.category = 'social'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:personaltext.noText' })
    )
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const socialModule = this.client.modules.social
    try {
      await socialModule.setPersonalText(author.id, text)
      embed.setTitle(t('commands:personaltext.changedSuccessfully'))
        .setDescription(text)
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'TEXT_LENGTH':
          embed.setTitle(t('commands:personaltext.tooLongText', { limit: socialModule.PERSONAL_TEXT_LIMIT }))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
