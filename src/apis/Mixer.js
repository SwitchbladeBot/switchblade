const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://mixer.com/api/v1'

module.exports = class MixerAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'mixer'
  }

  getUser (id) {
    return this.request(`/users/${id}`)
  }

  getChannel (id) {
    return this.request(`/channels/${id}`)
  }

  request (endpoint, queryParams = {}) {
    return snekfetch.get(`${API_URL}${endpoint}`)
      .query(queryParams)
      .then(r => r.body)
  }
}
