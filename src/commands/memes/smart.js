const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Smart extends Command {
  constructor (client) {
    super(client)

    this.name = 'smart'
    this.aliases = ['wesmart']
  }

  run (message) {
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setImage('https://media0.giphy.com/media/d3mlE7uhX8KFgEmY/source.gif')
    )
  }
}
