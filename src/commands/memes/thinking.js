const { Command, reddit } = require('../../')

module.exports = class Thinking extends Command {
  constructor (client) {
    super(client)
    this.name = 'thinking'
    this.aliases = ['thonk', 'thonking']
  }

  async run (message) {
    let embed = this.client.getDefaultEmbed(message.author)
    let random = await reddit.getRandomPostFromSubreddit('/r/thinking')
    message.channel.startTyping()
    embed.setImage(random.url)
    embed.setTitle(':thinking:')
    embed.setURL(`https://reddit.com${random.permalink}`)
    message.channel.send({embed})
    message.channel.stopTyping()
  }
}
