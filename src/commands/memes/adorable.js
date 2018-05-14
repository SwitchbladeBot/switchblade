const { Command } = require('../../')

module.exports = class Adorable extends Command {
  constructor (client) {
    super(client)

    this.name = 'adorable'
    this.aliases = ['adrlb']
  }

  run (message, args) {
    const template = 'https://api.adorable.io/avatars/256'
    const name = args.join(' ')
  
    let embed = this.client.getDefaultEmbed(message.author)
    embed.setImage(`${template}/${name}.png`)
    message.channel.send({embed})
  }
}
