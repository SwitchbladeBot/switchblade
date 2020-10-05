const { RandomRedditPostCommand } = require('../../')

module.exports = class OddlySatisfying extends RandomRedditPostCommand {
  constructor (client) {
    super({
      name: 'oddlysatisfying',
      aliases: ['odds'],
      category: 'reddit',
      subreddit: 'oddlysatisfying'
    }, client)
  }
}
