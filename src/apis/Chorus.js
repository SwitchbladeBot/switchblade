const { APIWrapper } = require('../')
const fetch = require('node-fetch')
const qs = require('querystring')

const API_URL = 'https://chorus.fightthe.pw/api'

module.exports = class ChorusAPI extends APIWrapper {
  constructor () {
    super({
      name: 'chorus'
    })
  }

  search (query) {
    return this.request('/search', { query }).then(r => r.songs)
  }

  request (endpoint, queryParams = {}) {
    return fetch(API_URL + endpoint + `?${qs.stringify(queryParams)}`)
      .then(res => res.json())
  }
}
