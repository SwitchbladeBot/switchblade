const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Boobs extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'boobs'
    this.subreddit = 'boobs'
    this.category = 'nsfw'
    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }
}
