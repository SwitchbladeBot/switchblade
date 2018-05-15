const { Command } = require('../../')
const request = require('snekfetch')

module.exports = class Dog extends Command {
  constructor (client) {
    super(client)
    this.name = 'dog'
    this.aliases = ['doggo', 'dogpics', 'randomdog']
  }

  run (message) {
    message.channel.startTyping()
    request.get('https://random.dog/woof.json').then(r => {
      var notsupported = ['.mp4']
      if (!r.body.url.endsWith(notsupported)) {
        const embed = this.client.getDefaultEmbed(message.author)
        embed.setImage(r.body.url).setDescription('Here is your dog <:DoggoF:445701839564963840>')
        message.channel.send({embed})
      } else {
        request.get('https://random.dog/woof.json').then(r => {
          const embed = this.client.getDefaultEmbed(message.author)
          embed.setImage(r.body.url).setDescription('Here is your dog <:DoggoF:445701839564963840>')
          message.channel.send({embed})
        })
      }
    })
    message.channel.stopTyping()
  }
}
