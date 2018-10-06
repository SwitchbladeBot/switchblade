const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Smart extends Command {
  constructor (client) {
    super(client)

    this.name = 'tipsfedora'
  }

  run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setImage('https://i.kym-cdn.com/entries/icons/original/000/014/711/neckbeard.jpg')
    channel.send(embed)
  }
}
