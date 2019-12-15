const { RandomRedditPostCommand } = require('../../')

module.exports = class Crossdressing extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'crossdressing',
      subreddit: 'traphentai',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
