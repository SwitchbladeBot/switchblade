const { APIWrapper } = require('../')

const Snoowrap = require('snoowrap')

module.exports = class RedditAPI extends APIWrapper {
  constructor () {
    super({
      name: 'reddit',
      envVars: [
        'REDDIT_CLIENT_ID',
        'REDDIT_CLIENT_SECRET',
        'REDDIT_REFRESH_TOKEN'
      ]
    })
  }

  load () {
    return new Snoowrap({
      userAgent: 'SwitchbladeBot http://switchblade.xyz/',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      refreshToken: process.env.REDDIT_REFRESH_TOKEN
    })
  }
}
