const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Hmmm extends Command {
  constructor (client) {
    super(client)
    this.name = 'hmmm'
    this.aliases = ['hm', 'hmm', 'hmmmm']
  }

  async run ({ author, channel }) {
    channel.startTyping()
    const { url, permalink } = await Reddit.getRandomPostFromSubreddit('/r/hmmm')
    channel.send(
      new SwitchbladeEmbed(author)
        .setTitle('hmmm')
        .setImage(url)
        .setURL(`https://reddit.com${permalink}`)
    ).then(() => channel.stopTyping())
  }
}
