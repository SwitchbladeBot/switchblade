const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class Hmmm extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'hmmm',
      aliases: ['hm', 'hmm', 'hmmmm'],
      category: 'memes',
      subreddit: 'hmmm',
      titleString: 'hmmm',
      requirements: { nsfwOnly: true }
    })
  }
}
