const RandomRedditPostCommand = require('../../structures/command/RandomRedditPostCommand.js')

module.exports = class OddlySatisfying extends RandomRedditPostCommand {
  constructor (client) {
    super(client, {
      name: 'oddlysatisfying',
      aliases: ['odds'],
      category: 'memes',
      subreddit: 'oddlysatisfying'
    })
  }
}
