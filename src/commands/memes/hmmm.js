const { Command } = require('../../')
const Reddit = require('../../utils/reddit.js')

module.exports = class Hmmm extends Command {
  constructor (client) {
    super(client)
    this.name = 'hmmm'
    this.aliases = ['hm', 'hmm', 'hmmmm']
  }

  async run (message) {
    let embed = this.client.getDefaultEmbed(message.author)
    let reddit = new Reddit('/r/hmmm')
    let post = await reddit.getRandomPostFromSubreddit()
    message.channel.startTyping()
    embed.setImage(post.url)
    embed.setTitle('hmmm')
    embed.setURL(`https://reddit.com${post.permalink}`)
    message.channel.send({embed})
    message.channel.stopTyping()
  }
}
