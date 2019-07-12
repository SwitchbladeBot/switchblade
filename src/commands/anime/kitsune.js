const { Command, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')
const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class Kitsune extends Command {
  constructor (client) {
    super(client, {
      name: 'kitsune',
      aliases: ['foxgirl'],
      category: 'anime'
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd kitsune if the channel is NSFW
    const endpoint = channel.nsfw ? 'lewdk' : 'fox_girl'

    const { url } = await fetch(nekoAPI + endpoint).then(res => res.json())

    embed.setImage(url)
      .setDescription(t('commands:kitsune.hereIsYour', { context: endpoint }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
