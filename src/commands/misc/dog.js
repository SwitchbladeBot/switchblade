const { Command, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class Dog extends Command {
  constructor (client) {
    super(client, {
      name: 'dog',
      aliases: ['doggo', 'dogpics', 'randomdog'],
      category: 'general'
    })
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { body } = await snekfetch.get('https://dog.ceo/api/breeds/image/random')
    embed.setImage(body.message)
      .setDescription(`${t('commands:dog.hereIsYourDog')} <:DoggoF:445701839564963840>`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
