const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class PornGifs extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'porngifs'
    this.subreddit = 'porngifs'
    this.category = 'nsfw'
    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }
}
