const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Thinking extends Command {
  constructor (client) {
    super(client)
    this.name = 'thinking'
    this.aliases = ['thonk', 'thonking', 'thonkang']
    this.category = 'memes'
  }

  async run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { url, permalink } = await Reddit.getRandomPostFromSubreddit('/r/thinking')
    embed.setTitle(':thinking:')
      .setImage(url)
      .setURL(`https://reddit.com${permalink}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
