const { RandomRedditPostCommand } = require('../../')

module.exports = class Porn extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'porn',
      subreddit: 'porn',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
