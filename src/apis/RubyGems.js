const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://rubygems.org/api/v1'

module.exports = class RubyGemsAPI extends APIWrapper {
  constructor () {
    super({
      name: 'rubygems',
      envVars: ['RUBYGEMS_API_KEY']
    })
  }

  search (query) {
    return this.request('/search.json', { query })
  }

  getGem (gem) {
    return this.request(`/gems/${gem}.json`)
  }

  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`, {
      headers: { Authorization: process.env.RUBYGEMS_API_KEY }
    }).then(res => res.json())
  }
}
