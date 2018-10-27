const { Command, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class Fox extends Command {
  constructor (client) {
    super(client)
    this.name = 'fox'
    this.category = 'general'
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get('https://randomfox.ca/floof/')
    embed.setImage(body.image)
      .setDescription(t('commands:fox.hereIsYourFox'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
