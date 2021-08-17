const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://beatsaver.com/api'

module.exports = class BeatSaverAPI extends APIWrapper {
  constructor () {
    super({
      name: 'beatsaver'
    })
  }

  getMapDetails (key) {
    return this.request(`/maps/detail/${key}`)
  }

  searchMaps (q) {
    return this.request('/search/text/0', { q, automapper: 1 }).then(r => r.docs)
  }

  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        accept: 'application/json'
      }
    }).then(res => res.json())
  }
}
