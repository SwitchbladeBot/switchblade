const { RandomRedditPostCommand } = require('../../')

module.exports = class Keanu extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'keanu',
      subreddit: 'KeanuBeingAwesome'
    }, client)
  }
}
