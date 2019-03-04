const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://chorus.fightthe.pw/api'

module.exports = class ChorusAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'chorus'
  }

  search (query) {
    return this.request('/search', { query }).then(r => r.songs)
  }

  request (endpoint, queryParams = {}) {
    return snekfetch.get(API_URL + endpoint)
      .query(queryParams)
      .then(r => r.body)
  }
}
