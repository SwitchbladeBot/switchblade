const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class OddlySatisfying extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'oddlysatisfying'
    this.aliases = ['odds']
    this.category = 'memes'
    this.subreddit = 'oddlysatisfying'
  }
}