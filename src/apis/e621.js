const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://e621.net'

module.exports = class e621 extends APIWrapper {
  constructor () {
    super({
      name: 'e621'
    })
  }

  async searchPost (tags) {
    const results = await this.request('/posts.json', { limit: 1, tags })
    return results
  }

  async request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    const fetched = await fetch(`${API_URL}${endpoint}?${qParams.toString()}`, {
      headers: { 'User-Agent': 'SwitchbladeBot/1.0 xDoges' }
    })
    return fetched.json()
  }
}
