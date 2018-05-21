const { Command, SwitchbladeEmbed } = require('../../index')
const snekfetch = require('snekfetch')
const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class Neko extends Command {
  constructor (client) {
    super(client)
    this.name = 'neko'
    this.aliases = ['nekogirl']
  }

  async run (message, args, translation) {
    message.channel.startTyping()

    // Send a lewd neko if the channel is NSFW
    const endpoint = message.channel.nsfw ? 'lewd' : 'neko'

    const { body } = await snekfetch.get(nekoAPI + endpoint)
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setImage(body.url)
        .setDescription(translation('commands:neko.hereIsYour', {context: endpoint}))
    ).then(() => message.channel.stopTyping())
  }
}
