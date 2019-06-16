const { APIWrapper } = require('../')
const fetch = require('node-fetch')

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
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`)
      .then(res => res.json())
  }
}
