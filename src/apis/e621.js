const { APIWrapper } = require('../')
const axios = require('axios')

module.exports = class e621 extends APIWrapper {
  constructor() {
    super({
      name: 'e621'
    })
  }

  async searchPost(tags, eURL = 'https://e926.net') {
    return this.request('/posts.json', { limit: 1, tags }, eURL)
  }

  async request(endpoint, queryParams = {}, eURL) {
    const qParams = new URLSearchParams(queryParams)
    const response = await axios.get(`${eURL}${endpoint}?${qParams.toString()}`, { headers: { 'User-Agent': 'SwitchbladeBot/1.0 xDoges' } });
    return response.data;
  }
}
