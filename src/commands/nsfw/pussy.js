const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Pussy extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'pussy'
    this.subreddit = 'pussy'
    this.category = 'nsfw'
    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }
}
