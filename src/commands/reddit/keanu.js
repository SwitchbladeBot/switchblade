const { RandomRedditPostCommand } = require('../../')

module.exports = class Keanu extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'keanu',
      subreddit: 'KeanuBeingAwesome'
    })
  }
}
