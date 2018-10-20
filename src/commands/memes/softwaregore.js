const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class SoftwareGore extends Command {
  constructor (client) {
    super(client)
    this.name = 'softwaregore'
    this.aliases = ['sg']
    this.category = 'memes'
  }

  async run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { url, permalink } = await Reddit.getRandomPostFromSubreddit('/r/softwaregore')
    embed.setTitle('🤔')
      .setImage(url)
      .setURL(`https://reddit.com${permalink}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
