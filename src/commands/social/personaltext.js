const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Personaltext extends Command {
  constructor (client) {
    super(client)
    this.name = 'personaltext'
    this.aliases = ['profiletext']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, missingError: 'commands:personaltext.noText' })
    )
  }

  async run ({ t, author, channel }, profileText) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    if (profileText.length > 150) {
      embed
        .setTitle(t('commands:personaltext.tooLongText'))
        .setColor(Constants.ERROR_COLOR)
    } else {
      // Database
      const userData = await this.client.database.users.get(author.id)
      userData.personalText = profileText
      userData.save()
      embed
        .setTitle(t('commands:personaltext.changedSuccessfully', { profileText }))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
