const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Hmmm extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'hmmm'
    this.subreddit = 'hmmm'
    this.titleString = 'hmmm'
    this.aliases = ['hm', 'hmm', 'hmmmm']
    this.category = 'memes'
  }
}
