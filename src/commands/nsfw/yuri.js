const { RandomRedditPostCommand } = require('../../')

module.exports = class Yuri extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'yuri',
      subreddit: 'yuri',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
