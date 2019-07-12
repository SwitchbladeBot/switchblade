const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://maps.googleapis.com/maps/api'

module.exports = class GoogleMapsAPI extends APIWrapper {
  constructor () {
    super({
      name: 'gmaps',
      envVars: ['GMAPS_KEY']
    })
  }

  // Search
  /**
   * Search a city location
   * @param {String} address The address query to search for
   * @param {String} [language=en-us] The string to the search query
   * @returns {Promise<?Object>} Returns the object of the location or returns null if not found
   */
  async searchCity (address, language = 'en-us') {
    const { status, results: [ result ] } = await this.request('/geocode', { address, language })
    if (status === 'OK' && result.address_components.some(({ types }) => {
      return types.includes('administrative_area_level_2') || types.includes('locality')
    })) {
      return result
    }
  }

  async searchPlace (address, language = 'en-us') {
    const { results: [ result ] } = await this.request('/geocode', { address, language })
    return result
  }

  async getTimezone (lat, lng, language = 'en-us') {
    return this.request('/timezone', { language, location: `${lat},${lng}`, timestamp: Date.now() / 1000 })
  }

  // Default
  request (endpoint, queryParams = {}) {
    queryParams.key = process.env.GMAPS_KEY
    const qParams = new URLSearchParams(queryParams)
    return fetch(`${API_URL}${endpoint}/json?${qParams.toString()}`)
      .then(res => res.json())
  }
}
