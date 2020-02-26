const { RandomRedditPostCommand } = require('../../')

module.exports = class Aww extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'aww',
      aliases: ['aw', 'cute', 'eyebleach'],
      category: 'memes',
      subreddit: 'aww',
      titleString: 'commands:aww.title'
    }, client)
  }
}
