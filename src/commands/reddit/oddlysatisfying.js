const { RandomRedditPostCommand } = require('../../')

module.exports = class OddlySatisfying extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'oddlysatisfying',
      aliases: ['odds'],
      category: 'memes',
      subreddit: 'oddlysatisfying'
    }, client)
  }
}
