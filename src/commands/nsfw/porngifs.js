const { RandomRedditPostCommand } = require('../../')

module.exports = class PornGifs extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'porngifs',
      subreddit: 'porngifs',
      category: 'nsfw',
      requirements: { nsfwOnly: true }
    })
  }
}
