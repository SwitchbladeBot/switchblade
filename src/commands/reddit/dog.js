const { RandomRedditPostCommand } = require('../../')

module.exports = class Dog extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'dog',
      aliases: ['doug'],
      category: 'general',
      titleString: 'commands:dog.hereIsYourDog',
      subreddit: 'dogpictures'
    }, client)
  }
}
