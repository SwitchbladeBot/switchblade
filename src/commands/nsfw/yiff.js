const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Yiff extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'yiff',
      subreddit: 'yiff',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
