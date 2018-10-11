const { CommandStructures, SwitchbladeEmbed } = require('../../')
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
    userDocument.favColor = hexcode
    userDocument.save()
    embed
      .setTitle(t('commands:favcolor.changedSuccessfully', { hexcode }))
      .setColor(hexcode)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
