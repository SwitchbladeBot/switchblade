const Command = require('./Command.js')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')
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

  canLoad () {
    return this.client.apis.reddit ? true : 'Required API wrapper "reddit" not found.'
  }

  // TODO: Check if the URL is an image type supported by reddit
  async run ({ channel, author, t }) {
    channel.startTyping()
    const response = await this.client.apis.reddit.getSubreddit(this.subreddit).getRandomSubmission()

    /*
      Reddit sometimes acts weird and sends an array as the response.
      These arrays may contain comments, so we filter them by their
      "names" (ids), which start with t3 for actual posts
    */
    let post
    if (Array.isArray(response)) {
      const filteredResponse = response.filter(submission => submission.name.startsWith('t3_'))
      post = filteredResponse[Math.floor(Math.random() * filteredResponse.length)]
    } else {
      post = response
    }

    channel.send(
      new SwitchbladeEmbed(author)
        .setTitle(this.addTitle ? (this.titleString ? t(this.titleString) : post.title) : '')
        .setColor(this.embedColor || process.env.EMBED_COLOR)
        .setURL(this.addPermalink ? `https://reddit.com${post.permalink}` : null)
        .setDescription(post.selftext ? this.shortenTextIfTooBig(post.selftext) : '')
        .setImage(post.url)
    ).then(() => channel.stopTyping())
  }

  shortenTextIfTooBig (text) {
    return text.length > 2048 ? text.substr(0, 2045) + '...' : text
  }
}
