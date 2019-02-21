const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Boobs extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'boobs',
      subreddit: 'boobs',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
