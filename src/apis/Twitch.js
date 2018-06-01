const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://api.twitch.tv/helix'

module.exports = class TwitchAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'twitch'
    this.envVars = ['TWITCH_CLIENT_ID']
  }

  load () {
    return this
  }

  async getUser (id) {
    const [ user ] = (await this.request('/users', { id })).data
    return user
  }

  async getStreamByUsername (username) {
    const [ stream ] = (await this.request('/streams', { user_login: username })).data
    return stream
  }

  async request (endpoint, queryParams) {
    const query = Object.keys(queryParams).map(k => `${k}=${queryParams[k]}`).join('&')
    return (await snekfetch.get(`${API_URL}${endpoint}?${query}`).set({'Client-ID': process.env.TWITCH_CLIENT_ID})).body
  }
}
