const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')
const { CommandStructures } = require('../../')
const { CommandRequirements } = CommandStructures

module.exports = class Hentai extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'hentai',
      subreddit: 'hentai',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
