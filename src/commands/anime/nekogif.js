const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command } = CommandStructures
const snekfetch = require('snekfetch')
const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class NekoGif extends Command {
  constructor (client) {
    super(client)
    this.name = 'nekogif'
    this.category = 'anime'
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd neko if the channel is NSFW
    const endpoint = channel.nsfw ? 'nsfw_neko_gif' : 'ngif'

    const { body: { url } } = await snekfetch.get(nekoAPI + endpoint)

    embed.setImage(url)
      .setDescription(t('commands:nekogif.hereIsYour', { context: endpoint }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
