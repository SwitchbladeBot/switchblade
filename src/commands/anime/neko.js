const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command } = CommandStructures
const snekfetch = require('snekfetch')
const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class Neko extends Command {
  constructor (client) {
    super(client)
    this.name = 'neko'
    this.aliases = ['nekogirl']
    this.category = 'anime'
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd neko if the channel is NSFW
    const endpoint = channel.nsfw ? 'lewd' : 'neko'

    const { body: { url } } = await snekfetch.get(nekoAPI + endpoint)

    embed.setImage(url)
      .setDescription(t('commands:neko.hereIsYour', { context: endpoint }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
