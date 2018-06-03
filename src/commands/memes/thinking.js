const { Command, RedditUtils, SwitchbladeEmbed } = require('../../')

module.exports = class Thinking extends Command {
  constructor (client) {
    super(client)
    this.name = 'thinking'
    this.aliases = ['thonk', 'thonking', 'thonkang']
  }

  async run (message) {
    message.channel.startTyping()
    const { url, permalink } = await RedditUtils.getRandomPostFromSubreddit('/r/thinking')
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setTitle(':thinking:')
        .setImage(url)
        .setURL(`https://reddit.com${permalink}`)
    ).then(() => message.channel.stopTyping())
  }
}
