const { RandomRedditPostCommand } = require('../../')

module.exports = class Showerthoughts extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'showerthoughts',
      subreddit: 'showerthoughts'
    }, client)
  }
}
