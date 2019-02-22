const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Smart extends Command {
  constructor (client) {
    super(client, {
      name: 'smart',
      aliases: ['wesmart'],
      category: 'memes'
    })
  }

  run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setImage('https://media0.giphy.com/media/d3mlE7uhX8KFgEmY/source.gif')
    channel.send(embed)
  }
}
