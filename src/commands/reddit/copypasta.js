const { RandomRedditPostCommand } = require('../../')

module.exports = class Copypasta extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'copypasta',
      category: 'memes',
      subreddit: 'copypasta'
    })
  }
}
