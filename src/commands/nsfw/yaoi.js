const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Yaoi extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'yaoi',
      subreddit: 'yaoi',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
