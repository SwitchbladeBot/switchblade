const { RandomRedditPostCommand } = require('../../')

module.exports = class Hentai extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'hentai',
      subreddit: 'SamePicOfSteveHarvey',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
