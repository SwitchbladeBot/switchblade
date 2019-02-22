const { RandomRedditPostCommand } = require('../../')

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
