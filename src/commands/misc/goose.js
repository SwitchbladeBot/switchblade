const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Goose extends Command {
  constructor (client) {
    super({
      name: 'goose',
      aliases: ['ganso', 'honkhonk'],
      category: 'images'
    }, client)
  }

  async run ({ t, channel, author }, user) {
    const body = await fetch('https://nekos.life/api/v2/img/goose').then(res => res.json())
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setImage(body.url)
      .setDescription(t('commands:goose.honk'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
