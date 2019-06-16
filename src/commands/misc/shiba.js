const { Command, SwitchbladeEmbed } = require('../../')

const fetch = require('node-fetch')

module.exports = class Shiba extends Command {
  constructor (client) {
    super(client, {
      name: 'shiba',
      aliases: ['shibainu', 'doge']
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const body = await fetch('http://shibe.online/api/shibes').then(res => res.json())
    embed.setDescription(`${t('commands:shiba.hereIsYourShiba')} <:DoggoF:445701839564963840>`)
    embed.setImage(body[0])
    channel.send(embed).then(() => channel.stopTyping())
  }
}
