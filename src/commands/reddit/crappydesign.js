const { RandomRedditPostCommand } = require('../../')

module.exports = class CrappyDesign extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'crappydesign',
      aliases: ['cd'],
      category: 'memes',
      subreddit: 'CrappyDesign'
    }, client)
  }
}
