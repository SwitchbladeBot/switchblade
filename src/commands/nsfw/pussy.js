const { RandomRedditPostCommand } = require('../../')

module.exports = class Pussy extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'pussy',
      subreddit: 'pussy',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
