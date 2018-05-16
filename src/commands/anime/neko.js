const { Command, SwitchbladeEmbed } = require('../../index')
const snekfetch = require('snekfetch')
const nekoAPI = "https://nekos.life/api/v2/img/"

module.exports = class Dog extends Command {
  constructor (client) {
    super(client)
    this.name = 'neko'
    this.aliases = ['nekogirl']
  }

  async run (message) {
    message.channel.startTyping()

    // Send a lewd neko if the channel is NSFW
    let endpoint = message.channel.nsfw ? "lewd" : "neko"

    const { body } = await snekfetch.get(nekoAPI + endpoint)
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setImage(body.url)
        .setDescription(`Here's your neko!`)
    ).then(() => message.channel.stopTyping())
  }
}
