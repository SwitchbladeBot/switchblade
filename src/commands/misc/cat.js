const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Cat extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'cat'
    this.aliases = ['catto', 'kitty']
    this.category = 'general'
    this.titleString = 'commands:cat.hereIsYourCat'
    this.subreddit = 'catpictures'
  }
}
