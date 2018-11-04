const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API_URL = 'https://api.spotify.com/v1'

module.exports = class SpotifyAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'spotify'
    this.envVars = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET']
    this.token = null
  }

  searchTracks (query, limit = 20) {
    return this.search(query, 'track', limit).then(res => res.tracks && res.tracks.total > 0 ? res.tracks.items : [])
  }

  search (query, type, limit = 20) {
    return this.request('/search', { q: query, type, limit }).then(u => u && u.data ? u.data[0] : u)
  }

  getAlbum (id) {
    return this.request(`/albums/${id}`)
  }

  getAlbumTracks (id, limit = 50) {
    return this.request(`/albums/${id}/tracks`, { limit })
  }

  getPlaylist (id) {
    return this.request(`/playlists/${id}`)
  }

  getPlaylistTracks (id, fields = 'fields=items(track(name,artists(name)))') {
    return this.request(`/playlists/${id}/tracks`, { fields })
  }

  getTrack (id) {
    return this.request(`/tracks/${id}`)
  }

  // Request
  async request (endpoint, queryParams = {}) {
    if (this.isTokenExpired) await this.getToken()
    return snekfetch.get(`${API_URL}${endpoint}`).query(queryParams).set(this.tokenHeaders).then(r => r.body)
  }

  async getToken () {
    const {
      access_token: accessToken,
      token_type: tokenType,
      expires_in: expiresIn
    } = await snekfetch.post(TOKEN_URL).set(this.credentialHeaders).query({ 'grant_type': 'client_credentials' }).then(r => r.body)

    const now = new Date()
    this.token = {
      accessToken,
      tokenType,
      expiresIn,
      expiresAt: new Date(now.getTime() + (expiresIn * 1000))
    }
  }

  get isTokenExpired () {
    return this.token ? this.token.expiresAt - new Date() <= 0 : true
  }

  // Authorization Headers
  get tokenHeaders () {
    return this.token ? { 'Authorization': `${this.token.tokenType} ${this.token.accessToken}` } : {}
  }

  get credentialHeaders () {
    const credential = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
    return { 'Authorization': `Basic ${credential}`, 'Content-Type': 'application/x-www-form-urlencoded' }
  }
}
