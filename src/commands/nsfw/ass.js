const { RandomRedditPostCommand } = require('../../')

module.exports = class Ass extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'ass',
      subreddit: 'ass',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
