const { RandomRedditPostCommand } = require('../../')

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
