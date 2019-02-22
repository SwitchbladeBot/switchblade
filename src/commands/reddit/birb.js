const { RandomRedditPostCommand } = require('../../')

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
