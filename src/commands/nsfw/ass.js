const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Ass extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'ass',
      subreddit: 'ass',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
