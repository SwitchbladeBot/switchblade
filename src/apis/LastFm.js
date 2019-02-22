const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'http://ws.audioscrobbler.com/2.0/'

module.exports = class LastFM extends APIWrapper {
  constructor () {
    super()
    this.name = 'lastfm'
    this.envVars = ['LASTFM_KEY']
  }

  // GET METHODS
  getArtistInfo (artist, lang = 'en') {
    return this.request('artist.getInfo', { artist, lang })
  }

  getAlbumInfo (album, artist, lang = 'en') {
    return this.request('album.getInfo', { album, artist, lang, autocorrect: 1 })
  }

  getTrackInfo (track, artist, lang = 'en') {
    return this.request('track.getInfo', { track, artist, lang, autocorrect: 1 })
  }

  getUserInfo (user) {
    return this.request('user.getInfo', { user })
  }

  getUserTop (user, top = 'artists', period = '1month', limit = 50) {
    const queryParams = { user, period, limit }
    return this.request(`user.getTop${top.charAt(0).toUpperCase() + top.slice(1)}`, queryParams)
  }

  // SEARCH METHODS
  searchTrack (track, limit = 30) {
    return this.request('track.search', { track, limit })
  }

  searchArtist (artist, limit = 30) {
    return this.request('artist.search', { artist, limit })
  }

  searchAlbum (album, limit = 30) {
    return this.request('album.search', { album, limit })
  }

  // MAIN REQUEST
  request (method, queryParams = {}) {
    const params = { method, api_key: process.env.LASTFM_KEY, format: 'json' }
    Object.assign(queryParams, params)
    return snekfetch.get(API_URL).query(queryParams).then(r => r.body)
  }
}
