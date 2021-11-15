const { Command, SwitchbladeEmbed } = require('../../')
const fetch = require('node-fetch')

module.exports = class Dog extends Command {
  constructor (client) {
    super({
      name: 'dog',
      aliases: ['doggo', 'dogpics', 'randomdog'],
      category: 'general'
    }, client)
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)

    const { message } = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json())
    embed.setImage(message)
      .setDescription(`${t('commands:dog.hereIsYourDog')} 🐕`)
    channel.send({ embeds: [embed] })
  }
}
