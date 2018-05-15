const { Command } = require('../../')
const Reddit = require('../../utils/Reddit.js')

module.exports = class Thinking extends Command {
  constructor (client) {
    super(client)
    this.name = 'thinking'
    this.aliases = ['thonk', 'thonking', 'thonkang']
  }

  async run (message) {
    let embed = this.client.getDefaultEmbed(message.author)
    let reddit = new Reddit('/r/thinking')
    let random = await reddit.getRandomPostFromSubreddit()
    message.channel.startTyping()
    embed.setImage(random.url)
    embed.setTitle(':thinking:')
    embed.setURL(`https://reddit.com${random.permalink}`)
    message.channel.send({embed})
    message.channel.stopTyping()
  }
}
