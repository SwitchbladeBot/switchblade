const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API_URL = 'https://api.spotify.com/v1'

module.exports = class SpotifyAPI extends APIWrapper {
  constructor () {
    super({
      name: 'spotify',
      envVars: ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET']
    })

    this.token = null
  }

  // Search
  searchTracks (query, limit = 20) {
    return this.search(query, 'track', limit).then(res => res.tracks && res.tracks.total > 0 ? res.tracks.items : [])
  }

  searchAlbums (query, limit = 20) {
    return this.search(query, 'album', limit).then(res => res.albums && res.albums.total > 0 ? res.albums.items : [])
  }

  searchArtists (query, limit = 20) {
    return this.search(query, 'artist', limit).then(res => res.artists && res.artists.total > 0 ? res.artists.items : [])
  }

  searchPlaylists (query, limit = 20) {
    return this.search(query, 'playlist', limit).then(res => res.playlists && res.playlists.total > 0 ? res.playlists.items : [])
  }

  search (query, type, limit = 20) {
    return this.request('/search', { q: query, type, limit }).then(u => u && u.data ? u.data[0] : u)
  }

  // Gets
  getUser (user) {
    return this.request(`/users/${user}`)
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

  getArtist (id) {
    return this.request(`/artists/${id}`)
  }

  getArtistAlbums (id, limit = 50, include = ['album', 'single']) {
    return this.request(`/artists/${id}/albums`, { limit, include_groups: include.join() })
  }

  // Request
  async request (endpoint, queryParams = {}) {
    if (this.isTokenExpired) await this.getToken()
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`, {
      headers: this.tokenHeaders
    }).then(res => res.json())
  }

  async getToken () {
    const grantPar = new URLSearchParams({ grant_type: 'client_credentials' })
    const {
      access_token: accessToken,
      token_type: tokenType,
      expires_in: expiresIn
    } = await fetch(TOKEN_URL + `?${grantPar.toString()}`, {
      method: 'POST',
      headers: this.credentialHeaders
    }).then(res => res.json())

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
    return this.token ? { Authorization: `${this.token.tokenType} ${this.token.accessToken}` } : {}
  }

  get credentialHeaders () {
    const credential = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')
    return { Authorization: `Basic ${credential}`, 'Content-Type': 'application/x-www-form-urlencoded' }
  }
}
