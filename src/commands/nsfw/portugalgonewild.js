const { RandomRedditPostCommand } = require('../../')

module.exports = class PortugalGoneWild extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'portugalgonewild',
      aliases: ['pgw'],
      subreddit: 'portugalgonewild',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
