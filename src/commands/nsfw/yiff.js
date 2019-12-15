const { RandomRedditPostCommand } = require('../../')

module.exports = class Yiff extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'yiff',
      subreddit: 'yiff',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
