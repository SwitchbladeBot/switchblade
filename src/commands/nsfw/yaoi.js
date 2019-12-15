const { RandomRedditPostCommand } = require('../../')

module.exports = class Yaoi extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'yaoi',
      subreddit: 'yaoi',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
