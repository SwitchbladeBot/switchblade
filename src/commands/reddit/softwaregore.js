const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class SoftwareGore extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'softwaregore'
    this.aliases = ['sg']
    this.category = 'memes'
    this.subreddit = 'softwaregore'
  }
}
