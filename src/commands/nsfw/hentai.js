const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Hentai extends RandomRedditPostCommand {
  constructor (client) {
    super(client)
    this.name = 'hentai'
    this.subreddit = 'hentai'
    this.category = 'nsfw'
    this.requirements = new CommandRequirements(this, { nsfwOnly: true })
  }
}
