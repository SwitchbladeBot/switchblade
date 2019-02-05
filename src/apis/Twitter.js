const { APIWrapper } = require('../')
const Twit = require('twit')

module.exports = class Twitter extends APIWrapper {
  constructor () {
    super()
    this.name = 'twitter'
    this.envVars = ['TWITTER_CONSUMER_KEY', 'TWITTER_CONSUMER_SECRET', 'TWITTER_ACCESS_TOKEN_KEY', 'TWITTER_ACCESS_TOKEN_SECRET']
    this.twit = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
      timeout_ms: 60 * 1000,
      strictSSL: true
    })
  }

  async getUser (user) {
    return new Promise((resolve) => {
      this.twit.get('users/lookup', { screen_name: user })
        .then(res => {
          resolve(res.data[0])
        })
        .catch(err => {
          if (err && err.code === 17) resolve(null)
        })
    })
  }

  createStream (id) {
    return this.twit.stream('statuses/filter', {
      follow: id
    }).on('tweet', this.tweet)
      .on('error', this.error)
  }

  tweet (data) {
    return console.log(data)
  }

  error (error) {
    throw new Error(error)
  }
}
