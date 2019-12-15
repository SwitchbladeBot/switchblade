const { RandomRedditPostCommand } = require('../../')

module.exports = class Copypasta extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'copypasta',
      category: 'memes',
      subreddit: 'copypasta'
    }, client)
  }
}
