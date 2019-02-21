const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Anal extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'anal',
      subreddit: 'anal',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
