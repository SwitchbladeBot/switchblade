const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command } = CommandStructures
const snekfetch = require('snekfetch')
const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class Neko extends Command {
  constructor (client) {
    super(client)
    this.name = 'neko'
    this.aliases = ['nekogirl']
  }

  async run ({ t, author, channel }) {
    channel.startTyping()

    // Send a lewd neko if the channel is NSFW
    const endpoint = channel.nsfw ? 'lewd' : 'neko'

    const { body: { url } } = await snekfetch.get(nekoAPI + endpoint)
    channel.send(
      new SwitchbladeEmbed(author)
        .setImage(url)
        .setDescription(t('commands:neko.hereIsYour', {context: endpoint}))
    ).then(() => channel.stopTyping())
  }
}
