const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Favcolor extends Command {
  constructor (client) {
    super(client)
    this.name = 'favcolor'
    this.aliases = ['favoritecolor', 'sethex', 'setcolor']

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, missingError: 'commands:favcolor.invalidhex'})
    )
  }

  async run ({ t, author, channel }, hexcolor) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    // Regex
    const REGEX_PATH = /^#(([0-9a-f]){3}){1,2}$/i
    const hexcode = hexcolor.match(REGEX_PATH)
    if (hexcode == null) {
      embed.setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:favcolor.invalidHex'))
    } else {
      // Database
      const userData = await this.client.database.users.get(author.id)
      const favColor = userData.favColor
      userData.favColor = hexcode.input
      userData.save()
      embed
        .setTitle(t('commands:favcolor.changedSuccessfully') + favColor)
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
