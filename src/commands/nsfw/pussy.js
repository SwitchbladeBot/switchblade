const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Pussy extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'pussy',
      subreddit: 'pussy',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
