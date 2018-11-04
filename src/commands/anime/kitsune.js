const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command } = CommandStructures
const snekfetch = require('snekfetch')
const nekoAPI = 'https://nekos.life/api/v2/img/'

module.exports = class Kitsune extends Command {
  constructor (client) {
    super(client)
    this.name = 'kitsune'
    this.aliases = ['foxgirl']
    this.category = 'anime'
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()

    // Send a lewd kitsune if the channel is NSFW
    const endpoint = channel.nsfw ? 'lewdk' : 'fox_girl'

    const { body: { url } } = await snekfetch.get(nekoAPI + endpoint)

    embed.setImage(url)
      .setDescription(t('commands:kitsune.hereIsYour', { context: endpoint }))

    channel.send(embed).then(() => channel.stopTyping())
  }
}
