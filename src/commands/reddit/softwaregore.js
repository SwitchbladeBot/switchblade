const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class SoftwareGore extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'softwaregore',
      aliases: ['sg'],
      category: 'memes',
      subreddit: 'softwaregore'
    })
  }
}
