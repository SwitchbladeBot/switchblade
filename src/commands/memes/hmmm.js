const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Hmmm extends Command {
  constructor (client) {
    super(client)
    this.name = 'hmmm'
    this.aliases = ['hm', 'hmm', 'hmmmm']
    this.category = 'memes'
  }

  async run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { url, permalink } = await Reddit.getRandomPostFromSubreddit('/r/hmmm')
    embed.setTitle('hmmm')
      .setImage(url)
      .setURL(`https://reddit.com${permalink}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
