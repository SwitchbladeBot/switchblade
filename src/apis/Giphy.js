const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const apiHost = 'https://api.giphy.com/v1'

module.exports = class GiphyAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'giphy'
    this.envVars = ['GIPHY_API_KEY']
  }

  getRandomGIF (tag) {
    return this.request('/gifs/random', { tag })
  }

  async request (endpoint, parameters) {
    return snekfetch
      .get(`${apiHost}${endpoint}`)
      .query({ ...parameters, ...{ api_key: process.env.GIPHY_API_KEY } })
      .then(r => r.body)
  }
}
