const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://api.staging.kanga.gg/v1'

module.exports = class DBL extends APIWrapper {
  constructor () {
    super()
    this.name = 'kanga'
    this.envVars = ['KANGA_API_TOKEN']
  }

  search (search, limit = 20, game = 1, platform = 1) {
    const params = {
      where: `watcher_cache.platform:eq:${platform},watcher_cache.game:eq:${game}`,
      order: 'watcher_cache.viewer_count:desc',
      game,
      search,
      limit
    }
    return this.request('/search', params)
  }

  request (endpoint, queryParams = {}) {
    return snekfetch.get(API_URL + endpoint)
      .query(queryParams)
      .set('Authorization', `Bearer: ${process.env.KANGA_API_TOKEN}`)
      .then(r => r.body)
  }
}
