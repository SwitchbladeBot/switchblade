const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://discordbots.org/api'

module.exports = class DBL extends APIWrapper {
  constructor () {
    super({
      name: 'dbl',
      envVars: ['DBL_TOKEN']
    })
  }

  searchBots (query, maxValues) {
    return this.request('/bots', { search: query, limit: maxValues }).then(u => u.results)
  }

  getBot (id) {
    return this.request(`/bots/${id}`).then(u => u)
  }

  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`, {
      headers: { Authorization: process.env.DBL_TOKEN }
    }).then(res => res.json())
  }
}
