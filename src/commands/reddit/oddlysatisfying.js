const { RandomRedditPostCommand } = require('../../')

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
