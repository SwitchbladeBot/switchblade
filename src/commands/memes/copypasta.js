const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class Hmmm extends Command {
  constructor (client) {
    super(client)
    this.name = 'copypasta'
    this.aliases = []
  }

  async run (message) {
    const embed = new SwitchbladeEmbed(message.author)
    const { title, selftext, permalink } = await Reddit.getRandomPostFromSubreddit('/r/copypasta')
    let pasta
    if (selftext.length > 2048) pasta = selftext.substr(0, 2045) + '...'
    else pasta = selftext
    message.channel.startTyping()
    embed.setTitle(title)
      .setDescription(pasta)
      .setURL(`https://reddit.com${permalink}`)
    message.channel.send(embed).then(() => message.channel.stopTyping())
  }
}
