const { Command } = require('../../')

module.exports = class Bolsonaro extends Command {
  constructor (client) {
    super(client)

    this.name = 'bolsonaro'
    this.aliases = ['bolsomito', 'bolsomito2018', 'jair']
  }

  run (message) {
    let embed = this.client.getDefaultEmbed(message.author)
    embed.setImage('http://i.join-my.stream/bolsonaro.jpg')
    message.channel.send({embed})
  }
}
