const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Adorable extends Command {
  constructor (client) {
    super(client)

    this.name = 'adorable'
  }

  run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    const template = 'https://api.adorable.io/avatars/256'
    embed.setImage(`${template}/${author.avatar}.png`)
    channel.send(embed)
  }
}
