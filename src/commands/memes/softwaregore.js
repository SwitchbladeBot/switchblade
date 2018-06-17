const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class SoftwareGore extends Command {
  constructor (client) {
    super(client)
    this.name = 'softwaregore'
    this.aliases = ['sg']
  }

  async run ({ author, channel }) {
    channel.startTyping()
    const { url, permalink } = await Reddit.getRandomPostFromSubreddit('/r/softwaregore')
    channel.send(
      new SwitchbladeEmbed(author)
        .setTitle('<:meowthonkang:446407184373383169>')
        .setImage(url)
        .setURL(`https://reddit.com${permalink}`)
    ).then(() => channel.stopTyping())
  }
}
