const { RandomRedditPostCommand } = require('../../')

module.exports = class CrappyDesign extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'crappydesign',
      aliases: ['cd'],
      category: 'memes',
      subreddit: 'CrappyDesign',
      titleString: 'commands:crappydesign.title'
    })
  }
}
