const { APIWrapper } = require('../')
const axios = require('axios')
const genius = require('genius-lyrics-api')

const API_URL = 'https://api.genius.com'

module.exports = class GeniusAPI extends APIWrapper {
  constructor () {
    super({
      name: 'genius',
      envVars: ['GENIUS_API']
    })
  }

  // Find a track
  findTrack (q) {
    return this.request('/search', { q })
  }

  // Load lyrics from the html
  loadLyrics (url) {
    return genius.getLyrics(url)
  }

  // Default
  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return axios.get(API_URL + endpoint + `?${qParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${process.env.GENIUS_API}`
      }
    }).then(res => res.data)
  }
}
