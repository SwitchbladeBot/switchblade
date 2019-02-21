const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Yiff extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'yiff',
      subreddit: 'yiff',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
