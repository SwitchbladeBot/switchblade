const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Yuri extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'yuri',
      subreddit: 'yuri',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
