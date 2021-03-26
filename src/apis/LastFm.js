const { APIWrapper } = require('../')
const fetch = require('node-fetch')
const crypto = require('crypto')

const API_URL = 'http://ws.audioscrobbler.com/2.0/'

module.exports = class LastFM extends APIWrapper {
  constructor () {
    super({
      name: 'lastfm',
      envVars: ['LASTFM_KEY', 'LASTFM_SECRET']
    })
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
    const match = LastFM.getFilteredTrack(source, author, title)
    const song = await this.getMatchedSong(match.title, match.artist)
    if (!song) return false
    return this.request('track.updateNowPlaying', {
      sk,
      track: song.name,
      artist: song.artist.name,
      duration: length / 1000
    }, true, true, 'xml').then(r => r.toString())
  }

  // SCROBBLE
  async scrobbleSong ({ title, source, author, length }, timestamp, sk) {
    const match = LastFM.getFilteredTrack(source, author, title)
    const song = await this.getMatchedSong(match.title, match.artist)
    if (!song) return false
    return this.request('track.scrobble', {
      sk,
      track: song.name,
      artist: song.artist.name,
      duration: length / 1000,
      timestamp: timestamp.getTime() / 1000
    }, true, true).then(r => r.scrobbles)
  }

  // LOVE SONG
  async loveSong ({ title, source, author, length }, sk) {
    const match = LastFM.getFilteredTrack(source, author, title)
    const song = await this.getMatchedSong(match.title, match.artist)
    this.request('track.love', {
      sk,
      track: song.name,
      artist: song.artist.name
    }, true, true, 'xml')
  }

  async unloveSong ({ title, source, author, length }, sk) {
    const match = LastFM.getFilteredTrack(source, author, title)
    const song = await this.getMatchedSong(match.title, match.artist)
    this.request('track.unlove', {
      sk,
      track: song.name,
      artist: song.artist.name
    }, true, true, 'xml')
  }

  // MAIN REQUEST
  /**
   * Creates a request for the Last.fm api
   * @param {string} method - the request method
   * @param {Object} queryParams - the query params for the request (and for the body, if write enabled)
   * @param {boolean} [signature=false] - if the request need's a signature
   * @param {boolean} [write=false] - if the request is a write type
   * @param {string} [format=json] - the result format
   * @returns {Promise<Object>}
   */
  request (method, queryParams, signature = false, write = false, format = 'json') {
    const params = { method, api_key: process.env.LASTFM_KEY, format }
    Object.assign(queryParams, params)
    if (signature) queryParams.api_sig = this.getSignature(queryParams)
    const qParams = new URLSearchParams(queryParams)
    if (!write) return fetch(API_URL + `?${qParams.toString()}`).then(res => res.json())
    return fetch(API_URL + `?${qParams.toString()}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then(res => res.json())
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
   * @returns {Object}
   */
  static getFilteredTrack (source, artist, title) {
    const titleSplitted = title.split('-')[0]
    const test = source === 'youtube' ? titleSplitted.toLowerCase().replace(' ', '').includes(artist.toLowerCase().replace('vevo', '').replace(' ', '')) : false
    artist = test ? title.split(' - ')[0] : artist
    title = test ? title.split(' - ')[1] : title
    return { title, artist }
  }

  /**
   * @param {string} title - The song's name
   * @param {string} artist - The song's artist name
   * @returns {Promise<Object | Boolean>}
   */
  async getMatchedSong (title, artist) {
    const req = await this.getTrackInfo(title, artist)
    const { error } = req
    return error ? error === 6 : req.track
  }
}
