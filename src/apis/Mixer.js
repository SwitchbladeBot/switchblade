const { APIWrapper } = require('../')
const fetch = require('node-fetch')
const qs = require('querystring')

const API_URL = 'https://mixer.com/api/v1'

module.exports = class MixerAPI extends APIWrapper {
  constructor () {
    super({
      name: 'mixer'
    })
  }

  getUser (id) {
    return this.request(`/users/${id}`)
  }

  getChannel (id) {
    return this.request(`/channels/${id}`)
  }

  request (endpoint, queryParams = {}) {
    return fetch(API_URL + endpoint + `?${qs.stringify(queryParams)}`)
      .then(res => res.json())
  }
}
