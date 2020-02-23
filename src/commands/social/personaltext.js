const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Personaltext extends Command {
  constructor (client) {
    super({
      name: 'personaltext',
      aliases: ['profiletext'],
      category: 'social',
      requirements: { databaseOnly: true },
      parameters: [{
        type: 'string',
        full: true,
        missingError: 'commands:personaltext.noText'
      }]
    }, client)
  }

  async run ({ t, author, channel }, text) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const socialController = this.client.controllers.social
    try {
      await socialController.setPersonalText(author.id, text)
      embed.setTitle(t('commands:personaltext.changedSuccessfully'))
        .setDescription(text)
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
      switch (e.message) {
        case 'TEXT_LENGTH':
          embed.setTitle(t('commands:personaltext.tooLongText', { limit: socialController.PERSONAL_TEXT_LIMIT }))
          break
        default:
          embed.setTitle(t('errors:generic'))
      }
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
