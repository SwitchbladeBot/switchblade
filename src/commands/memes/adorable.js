const { Command } = require('../../')

module.exports = class Adorable extends Command {
  constructor (client) {
    super(client)

    this.name = 'adorable'
    this.aliases = ['adrlb']
  }

  run (message) {
    const template = 'https://api.adorable.io/avatars/256'
    let embed = this.client.getDefaultEmbed(message.author)
    embed.setImage(`${template}/${message.author.avatar}.png`)
    message.channel.send({embed})
  }
}
