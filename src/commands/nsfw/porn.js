const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Porn extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'porn',
      subreddit: 'porn',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
