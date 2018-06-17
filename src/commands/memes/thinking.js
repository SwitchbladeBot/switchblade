const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Thinking extends Command {
  constructor (client) {
    super(client)
    this.name = 'thinking'
    this.aliases = ['thonk', 'thonking', 'thonkang']
  }

  async run ({ author, channel }) {
    channel.startTyping()
    const { url, permalink } = await Reddit.getRandomPostFromSubreddit('/r/thinking')
    channel.send(
      new SwitchbladeEmbed(author)
        .setTitle(':thinking:')
        .setImage(url)
        .setURL(`https://reddit.com${permalink}`)
    ).then(() => channel.stopTyping())
  }
}
