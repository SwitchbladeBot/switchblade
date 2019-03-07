const { RandomRedditPostCommand } = require('../../')

module.exports = class Ass extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'ass',
      subreddit: 'ass',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
