const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Ass extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'ass',
      subreddit: 'ass',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
