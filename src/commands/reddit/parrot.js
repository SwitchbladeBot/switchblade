const { RandomRedditPostCommand } = require('../../')

module.exports = class Parrot extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'parrot',
      category: 'reddit',
      subreddit: 'partyparrot'
    }, client)
  }
}
