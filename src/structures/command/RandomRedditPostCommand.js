const { Command, Reddit, SwitchbladeEmbed } = require('../../')

module.exports = class RandomRedditPostCommand extends Command {
  constructor (client) {
    super(client)
    this.embedColor = null
    this.titleString = null
    this.addTitle = true
    this.addPermalink = true
    this.subreddit = 'all'
  }

  // TODO: Check if the URL is an image type supported by reddit

  async run ({ channel, author, t }) {
    channel.startTyping()
    const { url, title, selftext, permalink } = await Reddit.getRandomPostFromSubreddit(`/r/${this.subreddit}`)
    channel.send(
      new SwitchbladeEmbed(author)
        .setTitle(this.addTitle ? (this.titleString ? t(this.titleString) : title) : '')
        .setColor(this.embedColor || process.env.EMBED_COLOR)
        .setURL(this.addPermalink ? `https://reddit.com${permalink}` : null)
        .setDescription(this.shortenTextIfTooBig(selftext))
        .setImage(url)
    ).then(() => channel.stopTyping())
  }

  shortenTextIfTooBig (text) {
    return text.length > 2048 ? text.substr(0, 2045) + '...' : text
  }
}
