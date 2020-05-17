const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Dicksize extends Command {
  constructor (client) {
    super({
      name: 'dicksize',
      aliases: ['peepeesize']
    }, client)
  }

  run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    const size = author.id.slice(-3) % 20 + 1
    embed
      .setTitle(t('commands:dicksize.yourDickSize'))
      .setDescription(`${size} cm\n8${'='.repeat(size)}D`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
