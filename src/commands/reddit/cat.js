const { RandomRedditPostCommand } = require('../../')

module.exports = class Cat extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'cat',
      aliases: ['catto', 'kitty'],
      category: 'reddit',
      titleString: 'commands:cat.hereIsYourCat',
      subreddit: 'catpictures'
    }, client)
  }
}
