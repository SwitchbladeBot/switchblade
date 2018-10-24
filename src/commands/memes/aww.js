const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Aww extends Command {
  constructor (client) {
    super(client)
    this.name = 'aww'
    this.aliases = ['aw', 'cute', 'eyebleach']
    this.category = 'memes'
  }

  async run ({ t, author, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    const { url, permalink } = await Reddit.getRandomPostFromSubreddit('/r/aww')
    embed
      .setTitle(t('commands:aww.title'))
      .setImage(url)
      .setURL(`https://reddit.com${permalink}`)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
