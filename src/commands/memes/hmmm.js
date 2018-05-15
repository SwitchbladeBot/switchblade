const { Command, reddit } = require('../../')

module.exports = class Hmmm extends Command {
  constructor (client) {
    super(client)
    this.name = 'hmmm'
    this.aliases = ['hm', 'hmm', 'hmmmm']
  }

  async run (message) {
    let embed = this.client.getDefaultEmbed(message.author)
    let post = await reddit.getRandomPostFromSubreddit('/r/hmmm')
    message.channel.startTyping()
    embed.setImage(post.url)
    embed.setTitle('hmmm')
    embed.setURL(`https://reddit.com${post.permalink}`)
    message.channel.send({embed})
    message.channel.stopTyping()
  }
}
