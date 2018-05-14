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
    let thonkembed = this.client.getDefaultEmbed(message.author)
    request.get('https://reddit.com/r/thinking/random/.json').then(data => {
      let requested = data.body[0].data.children[0].data
      thonkembed.setImage(requested.url)
      thonkembed.setTitle(':thinking:')
      thonkembed.setURL(`https://reddit.com${requested.permalink}`)
      message.channel.send({thonkembed})
    })
    message.channel.stopTyping()
  }
}
