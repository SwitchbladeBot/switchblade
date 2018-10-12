const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class BolinaDeGorfe extends Command {
  constructor (client) {
    super(client)

    this.name = 'bolinadegorfe'
    this.aliases = ['bolinhadegolfe', 'bolinhadegorfe', 'bolinadegolfe']
    this.category = 'memes'
  }

  run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed
      .setTitle('ooo, boliña de gorfe')
      .setImage('https://j.gifs.com/9QVDRP.gif')
    channel.send(embed)
  }
}
