const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Adorable extends Command {
  constructor (client) {
    super(client)

    this.name = 'adorable'
  }

  run (message) {
    const template = 'https://api.adorable.io/avatars/256'
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setImage(`${template}/${message.author.avatar}.png`)
    )
  }
}
