const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandParameters, ColorParameter } = CommandStructures

module.exports = class FavColor extends Command {
  constructor (client) {
    super(client)
    this.name = 'favcolor'
    this.aliases = ['favoritecolor', 'sethex', 'setcolor']

    this.parameters = new CommandParameters(this,
      new ColorParameter({full: true, missingError: 'errors:invalidColor'})
    )
  }

  async run ({ t, author, channel }, color) {
    const hexcode = color.rgb(true)
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const userData = await this.client.database.users.get(author.id)
    userData.favColor = hexcode
    userData.save()
    embed.setTitle(t('commands:favcolor.changedSuccessfully', { hexcode }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
