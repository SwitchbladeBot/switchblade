const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Tesla extends Command {
  constructor (client) {
    super(client)
    this.name = 'tesla'
    this.aliases = ['weebmusk', 'teslaporn']
    this.category = 'general'
  }

  async run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { url, title, permalink } = await Reddit.getRandomPostFromSubreddit('/r/TeslaPorn')
    embed.setTitle(title)
      .setImage(url)
      .setURL(`https://reddit.com${permalink}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
