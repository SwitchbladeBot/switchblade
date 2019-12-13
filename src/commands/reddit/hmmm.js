const { RandomRedditPostCommand } = require('../../')

module.exports = class Hmmm extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'hmmm',
      aliases: ['hm', 'hmm', 'hmmmm'],
      category: 'memes',
      subreddit: 'hmmm',
      titleString: 'hmmm',
      requirements: { nsfwOnly: true }
    }, client)
  }
}
