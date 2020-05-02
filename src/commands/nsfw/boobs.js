const { RandomRedditPostCommand } = require('../../')

module.exports = class Boobs extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'boobs',
      subreddit: 'boobs',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
