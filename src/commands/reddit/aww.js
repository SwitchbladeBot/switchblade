const RandomRedditImageCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Aww extends RandomRedditImageCommand {
  constructor (client) {
    super(client)
    this.name = 'aww'
    this.aliases = ['aw', 'cute', 'eyebleach']
    this.category = 'memes'
    this.titleString = 'commands:aww.title'
    this.subreddit = 'aww'
  }
}
