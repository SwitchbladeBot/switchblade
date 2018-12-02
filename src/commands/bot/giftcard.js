const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class Giftcard extends Command {
  constructor (client) {
    super(client)
    this.name = 'giftcard'
    this.category = 'bot'

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true, openedDms: true })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author).setTitle('cu buseta.jpg')
    channel.startTyping()
    channel.send(embed).then(() => channel.stopTyping())
  }
}
