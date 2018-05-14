const { Command } = require('../../')

module.exports = class Smart extends Command {
  constructor (client) {
    super(client)

    this.name = 'smart'
    this.aliases = ['wesmart']
  }

  run (message) {
    let embed = this.client.getDefaultEmbed(message.author)
    embed.setImage('https://media0.giphy.com/media/d3mlE7uhX8KFgEmY/source.gif')
    message.channel.send({embed})
  }
}
