const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class RandomRedditImageCommand extends Command {
  constructor (client) {
    super(client)
    this.embedColor = null
    this.titleString = null
    this.addTitle = true
    this.addPermalink = true
    this.subreddit = 'all'
  }

  async run ({channel, author, t}) {
    channel.startTyping()
    const { title, selftext, permalink } = await Reddit.getRandomPostFromSubreddit(`/r/${this.subreddit}`)
    channel.send(
      new SwitchbladeEmbed(author)
        .setTitle(this.addTitle ? (this.titleString ? t(this.titleString) : title) : '')
        .setColor(this.embedColor || process.env.EMBED_COLOR)
        .setURL(this.addPermalink ? `https://reddit.com${permalink}` : null)
        .setDescription(text)
    ).then(() => channel.stopTyping())
  }
}