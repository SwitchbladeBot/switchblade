const { RandomRedditPostCommand } = require('../../')

module.exports = class Pussy extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'pussy',
      subreddit: 'pussy',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
