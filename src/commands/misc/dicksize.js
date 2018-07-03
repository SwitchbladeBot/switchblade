const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Dicksize extends Command {
  constructor (client) {
    super(client)
    this.name = 'dicksize'
    this.aliases = ['peepeesize']
  }

  async run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const size = await Math.floor((Math.random() * 20) + 1) + ' cm';
    embed.setTitle('Your Dicksize')
    .setDescription(String(size))
      channel.send(embed).then(() => channel.stopTyping())
  }
}