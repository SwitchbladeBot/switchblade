const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, ColorParameter } = CommandStructures

module.exports = class FavColor extends Command {
  constructor (client) {
    super(client)
    this.name = 'favcolor'
    this.aliases = ['favoritecolor', 'sethex', 'setcolor']
    this.category = 'social'

    this.parameters = new CommandParameters(this,
      new ColorParameter({ full: true, missingError: 'errors:invalidColor' })
    )
  }

  async run ({ t, author, channel, userDocument }, color) {
    const hexcode = color.rgb(true)
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    try {
      await this.client.modules.social.setFavoriteColor(author.id, hexcode)
      embed.setColor(hexcode)
        .setTitle(t('commands:favcolor.changedSuccessfully', { hexcode }))
    } catch (e) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:generic'))
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
