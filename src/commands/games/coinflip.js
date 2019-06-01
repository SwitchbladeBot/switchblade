const { Command, SwitchbladeEmbed } = require('../../')
const coins = {
  heads: 'https://i.imgur.com/yStXPCV.png',
  tails: 'https://i.imgur.com/kSteyPc.png'
}

module.exports = class Coinflip extends Command {
  constructor (client) {
    super(client, {
      name: 'coinflip',
      aliases: ['cf'],
      category: 'games'
    })
  }

  run ({ channel, author, t }) {
    const sides = ['heads', 'tails']
    const chosenSide = sides[Math.floor(Math.random() * sides.length)]
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setDescription(t('commands:coinflip.landed', { chosenSide }))
      .setThumbnail(coins[chosenSide])
    channel.send(embed).then(() => channel.stopTyping())
  }
}
