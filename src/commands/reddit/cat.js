const { RandomRedditPostCommand } = require('../../')

module.exports = class Cat extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'cat',
      aliases: ['catto', 'kitty'],
      category: 'general',
      titleString: 'commands:cat.hereIsYourCat',
      subreddit: 'catpictures'
    })
  }
}
