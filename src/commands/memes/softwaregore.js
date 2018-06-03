const { Command, RedditUtils, SwitchbladeEmbed } = require('../../')

module.exports = class SoftwareGore extends Command {
  constructor (client) {
    super(client)
    this.name = 'softwaregore'
    this.aliases = ['sg']
  }

  async run (message) {
    message.channel.startTyping()
    const { url, permalink } = await RedditUtils.getRandomPostFromSubreddit('/r/softwaregore')
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setTitle('<:meowthonkang:446407184373383169>')
        .setImage(url)
        .setURL(`https://reddit.com${permalink}`)
    ).then(() => message.channel.stopTyping())
  }
}
