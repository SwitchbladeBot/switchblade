const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://maps.googleapis.com/maps/api'

module.exports = class GoogleMapsAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'gmaps'
    this.envVars = ['GMAPS_KEY']
  }

  // Search
  /**
   * Search a city location
   * @param {String} address The address query to search for
   * @param {String} [language=en-us] The string to the search query
   * @returns {Promise<?Object>} Returns the object of the location or returns null if not found
   */
  searchCity (address, language = 'en-us') {
    return new Promise(async resolve => {
      let search = await this.request('/geocode', { address, language })
      if (search.status === 'OK') {
        let result = search.results[0]
        if (!result.address_components.find(res => res.types.includes('administrative_area_level_2') || res.types.includes('locality'))) { resolve(null) }
        resolve(result)
      } else resolve(null)
    })
  }

  // Default
  request (endpoint, queryParams = {}) {
    queryParams.key = process.env.GMAPS_KEY
    return snekfetch.get(`${API_URL}${endpoint}/json`).query(queryParams).then(r => r.body)
  }
}
