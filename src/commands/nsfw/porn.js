const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Porn extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'porn',
      subreddit: 'porn',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
