const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

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
