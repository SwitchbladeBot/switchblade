const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Tesla extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'tesla'
    this.aliases = ['weebmusk', 'teslaporn']
    this.category = 'general'
    this.subreddit = 'TeslaPorn'
  }
}
