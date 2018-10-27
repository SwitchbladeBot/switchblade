const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')
const cheerio = require('cheerio')

const API_URL = 'https://api.genius.com'

module.exports = class GeniusAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'genius'
    this.envVars = ['GENIUS_API']
  }

  // Find a track
  findTrack (q) {
    return this.request('/search', { q })
  }

  // Load lyrics from the html
  loadLyrics (url) {
    return snekfetch.get(url).then(r => {
      const $ = cheerio.load(r.body)
      return $('.lyrics') ? $('.lyrics').text().trim() : null
    })
  }

  // Default
  request (endpoint, queryParams = {}) {
    return snekfetch.get(`${API_URL}${endpoint}`)
      .query(queryParams)
      .set('Authorization', `Bearer ${process.env.GENIUS_API}`)
      .then(r => r.body)
  }
}
