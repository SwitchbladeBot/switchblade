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

    const size = author.discriminator % 20 + 1
    embed
      .setTitle(t('commands:dicksize.yourDickSize'))
      .setDescription(`${size} cm\n8${'='.repeat(size)}D`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
