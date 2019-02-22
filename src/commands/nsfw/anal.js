const { RandomRedditPostCommand } = require('../../')

module.exports = class Anal extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'anal',
      subreddit: 'anal',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
