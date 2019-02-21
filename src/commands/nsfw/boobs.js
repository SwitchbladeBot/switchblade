const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Boobs extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'boobs',
      subreddit: 'boobs',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
