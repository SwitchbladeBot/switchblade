const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')
const crypto = require('crypto')

const API_URL = 'http://ws.audioscrobbler.com/2.0/'

module.exports = class LastFM extends APIWrapper {
  constructor () {
    super()
    this.name = 'lastfm'
    this.envVars = ['LASTFM_KEY', 'LASTFM_SECRET']
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

  // AUTH
  getSession (token) {
    return this.request('auth.getSession', { token }, true).then(r => r.session)
  }
  getAuthenticatedUserInfo (sk) {
    return this.request('user.getInfo', { sk }, true).then(r => r.user)
  }

  // NOWPLAYING
  async updateNowPlaying ({ title, source, author, length }, sk) {
    if (!await this.checkSong(title, author)) return false
    return this.request('track.updateNowPlaying', {
      sk,
      track: this.getFilteredTrackName(source, author, title),
      artist: author,
      duration: length / 1000
    }, true, true).then(r => r.nowplaying)
  }

  // SCROBBLE
  async scrobbleSong ({ title, source, author, length }, timestamp, sk) {
    if (!await this.checkSong(title, author)) return false
    return this.request('track.scrobble', {
      sk,
      track: title,
      artist: author,
      duration: length / 1000,
      timestamp: timestamp.getTime() / 1000
    }, true, true).then(r => r.scrobbles)
  }

  // LOVE SONG
  loveSong ({ title, source, author, length }, sk) {
    const filtered = this.getFilteredTrackName(source, author, title)
    this.request('track.love', {
      sk,
      track: filtered,
      artist: author
    }, true, true, 'xml')
    return filtered
  }

  unloveSong ({ title, source, author, length }, sk) {
    const filtered = this.getFilteredTrackName(source, author, title)
    this.request('track.unlove', {
      sk,
      track: filtered,
      artist: author
    }, true, true, 'xml')
    return filtered
  }

  // MAIN REQUEST
  /**
   * Creates a request for the Last.fm api
   * @param {string} method - the request method
   * @param {Object} queryParams - the query params for the request (and for the body, if write enabled)
   * @param {boolean} [signature=false] - if the request need's a signature
   * @param {boolean} [write=false] - if the request is a write type
   * @param {string} [format=json] - the result format
   * @returns {Promise|*|Promise<never>|Promise<T>|PromiseLike<T | never>|Promise<T | never>}
   */
  request (method, queryParams, signature = false, write = false, format = 'json') {
    const params = { method, api_key: process.env.LASTFM_KEY, format }
    Object.assign(queryParams, params)
    if (signature) queryParams.api_sig = this.getSignature(queryParams)
    if (!write) return snekfetch.get(API_URL).query(queryParams).then(r => r.body)
    return snekfetch.post(API_URL)
      .set('content-type', 'application/x-www-form-urlencoded').send(queryParams).then(r => r.body)
  }

  /**
   * Creates a signature for requests.
   * @param {Object} params - the params object
   * @returns {string}
   */
  getSignature (params) {
    const keys = Object.keys(params)
    keys.splice(Object.keys(params).indexOf('format'), 1)
    const signature = keys.sort().map(p => `${p}${params[p]}`).join('')
    return crypto.createHash('md5').update(`${signature}${process.env.LASTFM_SECRET}`, 'utf8').digest('hex')
  }

  /**
   * Filters the name of the current playing song name.
   * @param {string} source - The song source identifier
   * @param {string} artist - The song artist
   * @param {string} title - the song name
   * @returns {string}
   */
  getFilteredTrackName (source, artist, title) {
    return source === 'youtube'
      ? title.split('-')[0].includes(artist) ? title.replace(artist, '').replace(' - ', '') : title
      : title
  }

  /**
   * @param {string} title - The song's name
   * @param {string} artist - The song's artist name
   * @returns {Promise<boolean>}
   */
  async checkSong (title, artist) {
    const { error } = await this.getTrackInfo(title, artist)
    return error === 6
  }
}
