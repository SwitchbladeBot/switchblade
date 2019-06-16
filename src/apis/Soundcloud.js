const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'http://api.soundcloud.com'

const CLIENT_ID_REFRESH_INTERVAL = 60 * 60 * 1000 // 1 hour
const PAGE_APP_SCRIPT_REGEX = /https:\/\/[A-Za-z0-9-.]+\/assets\/app-[a-f0-9-]+\.js/
const APP_SCRIPT_CLIENT_ID_REGEX = /,client_id:"([a-zA-Z0-9-_]+)"/

module.exports = class SoundcloudAPI extends APIWrapper {
  constructor () {
    super({
      name: 'soundcloud'
    })

    this.lastClientIdUpdate = 0
    this.clientId = null
  }

  load () {
    this.updateClientId()
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

  // Client ID
  async request (endpoint, queryParams = {}, tries = 0) {
    await this.updateClientId()

    queryParams['client_id'] = this.clientId
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`)
      .then(res => res.json())
      .catch(e => {
        if (e.statusCode === 401 && tries < 5) {
          this.lastClientIdUpdate = 0
          return this.request(endpoint, queryParams, ++tries)
        }
        return e
      })
  }

  updateClientId () {
    const now = Date.now()
    if (now - this.lastClientIdUpdate < CLIENT_ID_REFRESH_INTERVAL) return

    this.lastClientIdUpdate = now
    return this.findClientIdFromSite().then(id => {
      if (id) {
        this.clientId = id
        return id
      }
    }, e => {
      console.error('SoundCloud client ID update failed.', e.statusCode || e)
    })
  }

  findClientIdFromSite () {
    return this.findApplicationScriptUrl().then(this.findClientIdFromApplicationScript).catch(e => {
      console.error('Could not find application script from main page.', e.statusCode || e)
    })
  }

  async findApplicationScriptUrl () {
    return fetch('https://soundcloud.com').then(async res => {
      if (res.ok) {
        const body = await res.text()
        const regex = PAGE_APP_SCRIPT_REGEX.exec(body)
        if (regex) {
          return regex[0]
        }
      }
      return Promise.reject(new Error(res))
    })
  }

  async findClientIdFromApplicationScript (url) {
    return fetch(url).then(async res => {
      if (res.ok) {
        const body = await res.text()
        const regex = APP_SCRIPT_CLIENT_ID_REGEX.exec(body)
        if (regex) {
          return regex[1]
        }
      }
    })
  }
}
