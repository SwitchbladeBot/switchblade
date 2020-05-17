const { RandomRedditPostCommand } = require('../../')

module.exports = class Anal extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'anal',
      subreddit: 'anal',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
