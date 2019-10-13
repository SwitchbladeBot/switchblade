const { RandomRedditPostCommand } = require('../../')

module.exports = class Showerthoughts extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'showerthoughts',
      subreddit: 'showertoughts'
    })
  }
}
