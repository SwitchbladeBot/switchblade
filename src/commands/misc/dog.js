const { Command, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class Dog extends Command {
  constructor (client) {
    super(client)
    this.name = 'dog'
    this.aliases = ['doggo', 'dogpics', 'randomdog']
  }

  async run ({ t, author, channel }) {
    channel.startTyping()
    const doggo = await this.requestDoggo()
    channel.send(
      new SwitchbladeEmbed(author)
        .setImage(doggo)
        .setDescription(t('commands:dog.hereIsYourDog') + ' <:DoggoF:445701839564963840>')
    ).then(() => channel.stopTyping())
  }

  async requestDoggo () {
    const { body } = await snekfetch.get('https://random.dog/woof.json')
    const notSupported = ['.mp4']
    if (!body.url.endsWith(notSupported)) return body.url
    else return this.requestDoggo()
  }
}
