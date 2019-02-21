const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Yuri extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'yuri',
      subreddit: 'yuri',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
