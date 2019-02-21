const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Birb extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'birb',
      aliases: ['bird', 'borb'],
      category: 'memes',
      subreddit: 'birbs',
      titleString: 'commands:birb.hereIsYourBirb'
    })
  }
}
