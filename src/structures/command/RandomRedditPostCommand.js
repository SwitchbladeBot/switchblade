const Command = require('./Command.js')
const SwitchbladeEmbed = require('../SwitchbladeEmbed.js')
const Reddit = require('../../utils/Reddit.js')

const defVal = (o, k, d) => typeof o[k] === 'undefined' ? d : o[k]

module.exports = class RandomRedditPostCommand extends Command {
  constructor (client, options = {}) {
    super(client, options)
    this.embedColor = options.embedColor
    this.titleString = options.titleString
    this.addTitle = defVal(options, 'addTitle', true)
    this.addPermalink = defVal(options, 'addPermalink', true)
    this.subreddit = options.subreddit || 'all'
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
