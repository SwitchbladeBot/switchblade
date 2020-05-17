const Command = require('./Command.js')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')
const Reddit = require('../../utils/Reddit.js')
const Utils = require('../../utils')

module.exports = class RandomRedditPostCommand extends Command {
  constructor (opts = {}, client) {
    const options = Utils.createOptionHandler('RandomRedditPostCommand', opts)

    super(opts, client)

    this.embedColor = options.optional('embedColor')
    this.titleString = options.optional('titleString')
    this.addTitle = options.optional('addTitle', true)
    this.addPermalink = options.optional('addPermalink', true)
    this.subreddit = options.optional('subreddit', 'all')
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
