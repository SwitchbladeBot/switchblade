const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class OddlySatisfying extends Command {
  constructor (client) {
    super(client)
    this.name = 'oddlysatisfying'
    this.aliases = ['odds']
    this.category = 'memes'
  }

  async run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { url, title, permalink } = await Reddit.getRandomPostFromSubreddit('/r/oddlysatisfying')
    embed.setTitle(title)
      .setImage(url)
      .setURL(`https://reddit.com${permalink}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
