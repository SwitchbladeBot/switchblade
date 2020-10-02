const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class TipsFedora extends Command {
  constructor (client) {
    super({
      name: 'ahshit',
      category: 'memes'
    }, client)
  }

  run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setImage('https://media.giphy.com/media/8vIFoKU8s4m4CBqCao/source.gif')
    channel.send(embed)
  }
}
