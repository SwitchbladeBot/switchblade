const { RandomRedditPostCommand } = require('../../')

module.exports = class Tesla extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'tesla',
      aliases: ['weebmusk', 'teslaporn'],
      subreddit: 'TeslaPorn'
    }, client)
  }
}
