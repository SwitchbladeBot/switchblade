const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Yaoi extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'yaoi',
      subreddit: 'yaoi',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
