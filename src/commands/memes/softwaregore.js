const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class SoftwareGore extends Command {
  constructor (client) {
    super(client)
    this.name = 'softwaregore'
    this.aliases = ['sg']
  }

  async run ({ author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { url, permalink } = await Reddit.getRandomPostFromSubreddit('/r/softwaregore')
    embed.setTitle('<:meowthonkang:446407184373383169>')
      .setImage(url)
      .setURL(`https://reddit.com${permalink}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
