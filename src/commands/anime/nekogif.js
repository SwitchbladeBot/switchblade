const { Command, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')
const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class NekoGif extends Command {
  constructor (client) {
    super(client, {
      name: 'nekogif',
      category: 'anime'
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd neko if the channel is NSFW
    const endpoint = channel.nsfw ? 'nsfw_neko_gif' : 'ngif'

    const { url } = await fetch(nekoAPI + endpoint).then(res => res.json())

    embed.setImage(url)
      .setDescription(t('commands:nekogif.hereIsYour', { context: endpoint }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
