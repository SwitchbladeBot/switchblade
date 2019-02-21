const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

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
