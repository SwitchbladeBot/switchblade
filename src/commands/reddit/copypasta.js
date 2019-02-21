const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Copypasta extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'copypasta',
      category: 'memes',
      subreddit: 'copypasta'
    })
  }
}
