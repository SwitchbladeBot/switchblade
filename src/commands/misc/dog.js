const { Command, SwitchbladeEmbed } = require('../../')
const axios = require('axios')

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
    channel.startTyping()
    const response = await axios.get('https://dog.ceo/api/breeds/image/random');
    embed.setImage(response.data.message)
      .setDescription(`${t('commands:dog.hereIsYourDog')} <:DoggoF:445701839564963840>`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
