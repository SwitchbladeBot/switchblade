const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Hmmm extends Command {
  constructor (client) {
    super(client)
    this.name = 'hmmm'
    this.aliases = ['hm', 'hmm', 'hmmmm']
  }

  async run (message) {
    message.channel.startTyping()
    const { url, permalink } = await Reddit.getRandomPostFromSubreddit('/r/hmmm')
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setTitle('hmmm')
        .setImage(url)
        .setURL(`https://reddit.com${permalink}`)
    ).then(() => message.channel.stopTyping())
  }
}
