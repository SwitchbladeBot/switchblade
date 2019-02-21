const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

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
