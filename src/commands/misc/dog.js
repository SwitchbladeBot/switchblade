const { Command } = require('../../')
const request = require('snekfetch')

module.exports = class Dog extends Command {
  constructor (client) {
    super(client)
    this.name = 'dog'
    this.aliases = ['doggo', 'dogpics', 'randomdog']
  }

  async run (message) {
    message.channel.startTyping()
    await this.requestNewDoggo(message)
  }

  sendDoggo (message, r) {
    const embed = this.client.getDefaultEmbed(message.author)
    embed.setImage(r.body.url).setDescription('Here is your dog <:DoggoF:445701839564963840>')
    message.channel.send({embed})
    message.channel.stopTyping()
  }

  async requestDoggo (message) {
    const { req } = await request.get('https://random.dog/woof.json')
    const notSupported = ['.mp4']
    if (!req.body.url.endsWith(notSupported)) this.sendDoggo(message, req)
    else this.requestDoggo(message)
  }
}
