const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Hmmm extends Command {
  constructor (client) {
    super(client)
    this.name = 'copypasta'
    this.aliases = []
  }

  async run (message) {
    message.channel.startTyping()
    const { title, selftext, permalink } = await Reddit.getRandomPostFromSubreddit('/r/copypasta')
    let pasta
    if (selftext.length > 2048) pasta = selftext.substr(0, 2045) + '...'
    else pasta = selftext
    message.channel.send(
      new SwitchbladeEmbed(message.author)
        .setTitle(title)
        .setDescription(pasta)
        .setURL(`https://reddit.com${permalink}`)
    ).then(() => message.channel.stopTyping())
  }
}
