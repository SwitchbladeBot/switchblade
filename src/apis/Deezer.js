const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://api.deezer.com'

module.exports = class DeezerAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'deezer'
  }

  // Get
  getTrack (id) {
    return this.request(`/track/${id}`)
  }

  getAlbum (id) {
    return this.request(`/album/${id}`)
  }

  getArtist (id) {
    return this.request(`/artist/${id}`)
  }

  // Search
  findTracks (q) {
    return this.request('/search', { q })
  }

  findAlbums (q) {
    return this.request('/search/album', { q })
  }

  findArtists (q) {
    return this.request('/search/artist', { q })
  }

  // Default
  request (endpoint, queryParams = {}) {
    const query = Object.keys(queryParams).map(k => `${k}=${queryParams[k]}`).join('&')
    return snekfetch.get(`${API_URL}${endpoint}?${query}`).then(r => r.body)
  }
}
