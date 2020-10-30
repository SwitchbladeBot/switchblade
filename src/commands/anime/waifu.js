const { Command, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')
const waifuAPI = 'https://waifu.pics/api'

module.exports = class Waifu extends Command {
  constructor (client) {
    super({
      name: 'waifu',
      category: 'anime'
    }, client)
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd waifu if the channel is NSFW
    const type = channel.nsfw ? 'nsfw' : 'sfw'

    const { url } = await fetch(`${waifuAPI}/${type}/waifu`).then(res => res.json())

    embed.setImage(url)
      .setDescription(t('commands:waifu.hereIsYour', { context: type }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
