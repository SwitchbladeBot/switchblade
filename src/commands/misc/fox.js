const { Command, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')

module.exports = class Fox extends Command {
  constructor (client) {
    super({
      name: 'fox'
    }, client)
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { image } = await fetch('https://randomfox.ca/floof/').then(res => res.json())
    embed.setImage(image)
      .setDescription(t('commands:fox.hereIsYourFox'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
