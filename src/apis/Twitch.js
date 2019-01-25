const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://api.twitch.tv/helix'

module.exports = class TwitchAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'twitch'
    this.envVars = ['TWITCH_CLIENT_ID']
  }

  getUser (id) {
    return this.request('/users', { id }).then(u => u && u.data[0])
  }

  getUserByUsername (login) {
    return this.request('/users', { login }).then(u => u && u.data[0])
  }

  getFollowersFromId (id) {
    return this.request('/users/follows', { to_id: id }).then(u => u && u.total)
  }

  getGameNameFromId (id) {
    return this.request('/games', { id }).then(u => u && u.data[0] && u.data[0].name)
  }

  getStreamByUsername (username) {
    return this.request('/streams', { user_login: username }).then(s => s && s.data[0])
  }

  request (endpoint, queryParams = {}) {
    return snekfetch.get(`${API_URL}${endpoint}`)
      .query(queryParams)
      .set({ 'Client-ID': process.env.TWITCH_CLIENT_ID })
      .then(r => r.body)
  }
}
