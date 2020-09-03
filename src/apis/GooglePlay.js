const { APIWrapper } = require('../')
const gPlay = require('google-play-scraper')

module.exports = class GooglePlayStore extends APIWrapper {
  constructor () {
    super({
      name: 'gplaystore'
    })
  }

  async searchApp (query) {
    try {
      return await gPlay.search({ term: query, num: 10, fullDetail: true })
    } catch (e) {
      return new Error('Not found')
    }
  }
}
