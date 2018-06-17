const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Adorable extends Command {
  constructor (client) {
    super(client)

    this.name = 'adorable'
  }

  run ({ author, channel }) {
    const template = 'https://api.adorable.io/avatars/256'
    channel.send(
      new SwitchbladeEmbed(author)
        .setImage(`${template}/${author.avatar}.png`)
    )
  }
}
