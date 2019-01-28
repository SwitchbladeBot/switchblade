const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Birb extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'birb'
    this.aliases = ['bird', 'borb']
    this.category = 'memes'
    this.titleString = 'commands:birb.hereIsYourBirb'
    this.subreddit = 'birbs'
  }
}
