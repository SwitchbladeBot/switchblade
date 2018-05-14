const { Command } = require('../../')
const request = require('snekfetch')

module.exports = class Thinking extends Command {
  constructor (client) {
    super(client)
    this.name = 'thinking'
    this.aliases = ['thonk', 'thonking']
  }

  run (message) {
    message.channel.startTyping()
    let embed = this.client.getDefaultEmbed(message.author)
    request.get('https://reddit.com/r/thinking/random/.json').then(data => {
      let req = data.body[0].data.children[0].data
      embed.setImage(req.url)
      embed.setTitle(':thinking:')
      embed.setURL(`https://reddit.com${req.permalink}`)
      message.channel.send({embed})
    })
    message.channel.stopTyping()
  }
}
