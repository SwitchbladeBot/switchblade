const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://e621.net'

module.exports = class e621 extends APIWrapper {
  constructor () {
    super({
      name: 'e621'
    })
  }

  // Search
  // /**
  //  * Search a city location
  //  * @param {String} address The address query to search for
  //  * @param {String} [language=en-us] The string to the search query
  //  * @returns {Promise<?Object>} Returns the object of the location or returns null if not found
  //  */
  // async searchCity (address, language = 'en-us') {
  //   const { status, results: [ result ] } = await this.request('/geocode', { address, language })
  //   if (status === 'OK' && result.address_components.some(({ types }) => {
  //     return types.includes('administrative_area_level_2') || types.includes('locality')
  //   })) {
  //     return result
  //   }
  // }

  async searchPost (tags) {
    const results = await this.request('/posts.json', { limit: 1, tags })
    return results
  }

  // async randomPost (lat, lng, language = 'en-us') {
  //   return this.request('/timezone', { language, location: `${lat},${lng}`, timestamp: Date.now() / 1000 })
  // }

  // Default
  async request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    const fetched = await fetch(`${API_URL}${endpoint}?${qParams.toString()}`, {
      headers: { 'User-Agent': 'SandboxTesting/0.0 xDoges' }
    })
    return fetched.json()
  }
}
