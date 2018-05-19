const { Command, SwitchbladeEmbed } = require('../../')
const snekfetch = require('snekfetch')

module.exports = class Cat extends Command {
  constructor (client) {
    super(client)
    this.name = 'cat'
    this.aliases = ['kitty', 'catpics', 'randomcat']
  }

  async run (message) {
    message.channel.startTyping()
    const cat = await this.requestKitty(message)
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setImage(cat)
        .setDescription('Here is your cat :cat:')
    ).then(() => message.channel.stopTyping())
  }

  async requestKitty (message) {
    const { body } = await snekfetch.get('http://aws.random.cat/meow')
    const notSupported = ['.mp4']
    if (!body.file.endsWith(notSupported)) return body.file
    else return this.requestKitty(message)
  }
}
