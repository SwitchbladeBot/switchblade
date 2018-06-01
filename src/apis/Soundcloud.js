const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'http://api.soundcloud.com'

const CLIENT_ID_REFRESH_INTERVAL = 60 * 60 * 1000 // 1 hour
const PAGE_APP_SCRIPT_REGEX = /https:\/\/[A-Za-z0-9-.]+\/assets\/app-[a-f0-9-]+\.js/
const APP_SCRIPT_CLIENT_ID_REGEX = /,client_id:"([a-zA-Z0-9-_]+)"/

module.exports = class SoundcloudAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'soundcloud'

    this.lastClientIdUpdate = 0
    this.clientId = null
  }

  load () {
    this.updateClientId()
    return this
  }

  getTrack (id) {
    return this.request(`/tracks/${id}`)
  }

  getUser (id) {
    return this.request(`/users/${id}`)
  }

  getPlaylist (id) {
    return this.request(`/playlists/${id}`)
  }

  // Client ID
  async request (endpoint, queryParams = {}) {
    await this.updateClientId()

    queryParams['client_id'] = this.clientId
    const query = Object.keys(queryParams).map(k => `${k}=${queryParams[k]}`).join('&')
    return snekfetch.get(`${API_URL}${endpoint}?${query}`).then(r => r.body)
  }

  updateClientId () {
    const now = Date.now()
    if (now - this.lastClientIdUpdate < CLIENT_ID_REFRESH_INTERVAL) return

    this.lastClientIdUpdate = now
    return this.findClientIdFromSite().then(id => {
      this.clientId = id
      return id
    }, e => {
      console.error('SoundCloud client ID update failed.', e)
    })
  }

  findClientIdFromSite () {
    return this.findApplicationScriptUrl().then(this.findClientIdFromApplicationScript, e => {
      console.error('Could not find application script from main page.', e)
    })
  }

  async findApplicationScriptUrl () {
    const res = await snekfetch.get('https://soundcloud.com')
    if (res && res.statusCode === 200) {
      const body = res.body.toString()
      const regex = PAGE_APP_SCRIPT_REGEX.exec(body)
      if (regex) {
        return regex[0]
      }
    }
    throw new Error(res.statusCode)
  }

  async findClientIdFromApplicationScript (url) {
    const res = await snekfetch.get(url)
    if (res && res.statusCode === 200) {
      const body = res.body.toString()
      const regex = APP_SCRIPT_CLIENT_ID_REGEX.exec(body)
      if (regex) {
        return regex[1]
      }
    }
    throw new Error(res.statusCode)
  }
}
