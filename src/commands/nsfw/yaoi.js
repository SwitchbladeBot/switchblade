const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Yaoi extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'yaoi'
    this.subreddit = 'yaoi'
    this.category = 'nsfw'
    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }
}
