const RandomRedditImageCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Thinking extends RandomRedditImageCommand {
  constructor (client) {
    super(client)
    this.name = 'thinking'
    this.aliases = ['thonk', 'thonking', 'thonkang']
    this.category = 'memes'
    this.subreddit = 'thinking'
    this.addTitle = false
  }
}
