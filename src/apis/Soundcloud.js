const { APIWrapper } = require('../')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

const API_URL = 'http://api-v2.soundcloud.com'

const HARDCODED_CLIENT_ID = 'H2c34Q0E7hftqnuDHGsk88DbNqhYpgMm'
const APP_SCRIPT_CLIENT_ID_REGEX = /,client_id:"(.*?)"/

module.exports = class SoundcloudAPI extends APIWrapper {
  constructor () {
    super({
      name: 'soundcloud'
    })

    this._clientId = null
  }

  load () {
    this.clientId()
    return this
  }

  getTrack (id, secret) {
    return this.request(`/tracks/${id}`, { secret_token: secret })
  }

  getUser (id) {
    return this.request(`/users/${id}`)
  }

  getPlaylist (id) {
    return this.request(`/playlists/${id}`)
  }

  resolveTrack (url) {
    return this.request('/resolve', { url: encodeURI(url) })
  }

  // Client ID
  async request (endpoint, queryParams = {}) {
    queryParams.client_id = await this.clientId()
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
  }

  async clientId () {
    if (this._clientId) return this._clientId

    this._clientId = HARDCODED_CLIENT_ID
    if (await this.checkIfHardcodedClientIdIsValid()) {
      return this._clientId
    }
    this._clientId = null

    const $ = await fetch('https://soundcloud.com').then(async r => cheerio.load(await r.text()))
    const elements = $('script[src*="sndcdn.com/assets/"][src$=".js"]').get()
    elements.reverse()

    const headers = { Range: 'bytes=0-16384' }
    for (let i = 0; i < elements.length; i++) {
      const src = elements[i].attribs.src
      if (src) {
        try {
          const srcContent = await fetch(src, { headers }).then(r => r.text())
          const [, clientId] = APP_SCRIPT_CLIENT_ID_REGEX.exec(srcContent)
          this._clientId = clientId
          return clientId
        } catch (_) {
          // Ignore it and proceed to try searching other script
        }
      }
    }

    return null // Couldn't find valid client id
  }

  async checkIfHardcodedClientIdIsValid () {
    try {
      const track = await this.resolveTrack('https://soundcloud.com/roadrunner-usa/02-sick-bubblegum')
      return track && track.id === 35989476
    } catch (_) {
      return false
    }
  }
}
