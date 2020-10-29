const { Command, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')
const nekoAPI = 'https://waifu.pics/api'

module.exports = class Neko extends Command {
  constructor (client) {
    super({
      name: 'neko',
      aliases: ['nekogirl'],
      category: 'anime'
    }, client)
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd neko if the channel is NSFW
    const type = channel.nsfw ? 'nsfw' : 'sfw'

    const { url } = await fetch(`${nekoAPI}/${type}/neko`).then(res => res.json())

    embed.setImage(url)
      .setDescription(t('commands:neko.hereIsYour', { context: type }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
