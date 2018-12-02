const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Copypasta extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'copypasta'
    this.category = 'memes'
    this.subreddit = 'copypasta'
  }
}
