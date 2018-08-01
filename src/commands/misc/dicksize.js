const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Dicksize extends Command {
  constructor (client) {
    super(client)
    this.name = 'dicksize'
    this.aliases = ['peepeesize']
  }

  run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const size = `${Math.floor((Math.random() * 20) + 1)} cm`
    embed
      .setTitle(t('commands:dicksize.yourDickSize'))
      .setDescription(size)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
