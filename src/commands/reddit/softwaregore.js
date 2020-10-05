const { RandomRedditPostCommand } = require('../../')

module.exports = class SoftwareGore extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'softwaregore',
      aliases: ['sg'],
      category: 'reddit',
      subreddit: 'softwaregore'
    }, client)
  }
}
