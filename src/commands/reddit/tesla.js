const { RandomRedditPostCommand } = require('../../')

module.exports = class Tesla extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'tesla',
      aliases: ['weebmusk', 'teslaporn'],
      subreddit: 'TeslaPorn'
    })
  }
}
