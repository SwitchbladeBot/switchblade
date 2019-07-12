const { RandomRedditPostCommand } = require('../../')

module.exports = class Fursuit extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'fursuit',
      aliases: ['expensiveaf', 'furrysuit'],
      subreddit: 'fursuit'
    })
  }
}
