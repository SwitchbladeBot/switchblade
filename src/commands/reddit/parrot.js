const { RandomRedditPostCommand } = require('../../')

module.exports = class Parrot extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'parrot',
      subreddit: 'partyparrot'
    })
  }
}
