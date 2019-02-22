const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://discordbots.org/api'

module.exports = class DBL extends APIWrapper {
  constructor () {
    super()
    this.name = 'dbl'
    this.envVars = ['DBL_TOKEN']
  }

  searchBots (query, maxValues) {
    return this.request('/bots', { search: query, limit: maxValues }).then(u => u.results)
  }

  getBot (id) {
    return this.request(`/bots/${id}`).then(u => u)
  }

  request (endpoint, queryParams = {}) {
    return snekfetch.get(API_URL + endpoint)
      .query(queryParams)
      .set('Authorization', process.env.DBL_TOKEN)
      .then(r => r.body)
  }
}
