const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Tesla extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'tesla',
      aliases: ['weebmusk', 'teslaporn'],
      subreddit: 'TeslaPorn'
    })
  }
}
