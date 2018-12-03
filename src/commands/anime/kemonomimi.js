const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command } = CommandStructures
const snekfetch = require('snekfetch')
const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class Kemonomimi extends Command {
  constructor (client) {
    super(client)
    this.name = 'kemonomimi'
    this.category = 'anime'
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd kemonomimi if the channel is NSFW
    const endpoint = channel.nsfw ? 'lewdkemo' : 'kemonomimi'

    const { body: { url } } = await snekfetch.get(nekoAPI + endpoint)

    embed.setImage(url)
      .setDescription(t('commands:kemonomimi.hereIsYour', { context: endpoint }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
