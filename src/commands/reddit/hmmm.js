const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

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
