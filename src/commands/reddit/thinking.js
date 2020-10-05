const { RandomRedditPostCommand } = require('../../')

module.exports = class Thinking extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'thinking',
      aliases: ['thonk', 'thonking', 'thonkang'],
      category: 'reddit',
      subreddit: 'thinking',
      addTitle: false
    }, client)
  }
}
