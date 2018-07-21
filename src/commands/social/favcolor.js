const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, ColorParameter } = CommandStructures

module.exports = class Favcolor extends Command {
  constructor (client) {
    super(client)
    this.name = 'favcolor'
    this.aliases = ['favoritecolor', 'sethex', 'setcolor']

    this.parameters = new CommandParameters(this,
      new ColorParameter({full: true, missingError: 'errors:invalidColor'})
    )
  }

  async run ({ t, author, channel }, color) {
    color = color.hex(false)
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const userData = await this.client.database.users.get(author.id)
    userData.favColor = color
    userData.save()
    embed.setTitle(t('commands:favcolor.changedSuccessfully', { hexcode: color }))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
