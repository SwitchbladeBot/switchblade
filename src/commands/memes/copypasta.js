const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Copypasta extends Command {
  constructor (client) {
    super(client)
    this.name = 'copypasta'
    this.category = 'memes'
  }

  async run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { title, selftext, permalink } = await Reddit.getRandomPostFromSubreddit('/r/copypasta')
    const pasta = selftext.length > 2048 ? selftext.substr(0, 2045) + '...' : selftext
    embed.setTitle(title)
      .setDescription(pasta)
      .setURL(`https://reddit.com${permalink}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
