const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://instagram.com/'

module.exports = class InstagramAPI extends APIWrapper {
  constructor () {
    super({
      name: 'instagram'
    })
  }

  getUser (user) {
    return this.request(user)
  }

  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams({
      ...queryParams,
      __a: 1
    })
    return fetch(API_URL + endpoint + `?${qParams.toString()}`)
      .then(res => res.json())
  }
}
