const { Command, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')
const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class Kemonomimi extends Command {
  constructor (client) {
    super(client, {
      name: 'kemonomimi',
      category: 'anime'
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd kemonomimi if the channel is NSFW
    const endpoint = channel.nsfw ? 'lewdkemo' : 'kemonomimi'

    const { url } = await fetch(nekoAPI + endpoint).then(res => res.json())

    embed.setImage(url)
      .setDescription(t('commands:kemonomimi.hereIsYour', { context: endpoint }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
