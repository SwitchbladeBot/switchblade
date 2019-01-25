const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Yuri extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'yuri'
    this.subreddit = 'yuri'
    this.category = 'nsfw'
    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }
}
