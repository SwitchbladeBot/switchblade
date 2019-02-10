const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Ass extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'ass'
    this.subreddit = 'ass'
    this.category = 'nsfw'
    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }
}
