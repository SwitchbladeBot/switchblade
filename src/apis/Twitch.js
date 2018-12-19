const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://api.twitch.tv/kraken'

module.exports = class TwitchAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'twitch'
    this.envVars = ['TWITCH_CLIENT_ID']
  }

  getUser (id) {
    return this.request(`/users/${id}`).then(u => u)
  }

  getStreamByUsername (username) {
    return this.request(`/streams/${username}`).then(s => s)
  }

  request (endpoint, queryParams = {}) {
    return snekfetch.get(`${API_URL}${endpoint}`)
      .query(queryParams)
      .set({ 'Client-ID': process.env.TWITCH_CLIENT_ID })
      .then(r => r.body)
  }
}
