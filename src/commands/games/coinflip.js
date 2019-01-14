const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command } = CommandStructures

module.exports = class Coinflip extends Command {
  constructor (client) {
    super(client)
    this.name = 'coinflip'
    this.category = 'games'
  }

  run ({ channel, author, t }) {
    const sides = ['heads', 'tails']
    const chosenSide = sides[Math.floor(Math.random() * sides.length)]
    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(t('commands:coinflip.landed', { chosenSide }))
    )
  }
}
