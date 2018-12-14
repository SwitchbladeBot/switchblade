const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Hmmm extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'hmmm'
    this.subreddit = 'hmmm'
    this.titleString = 'hmmm'
    this.aliases = ['hm', 'hmm', 'hmmmm']
    this.category = 'memes'
    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }
}
