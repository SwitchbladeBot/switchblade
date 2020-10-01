const { APIWrapper } = require('../')
const axios = require('axios');
const API_URL = 'http://api.languagelayer.com/'

module.exports = class LanguageLayerAPI extends APIWrapper {
  constructor () {
    super({
      name: 'languagelayer',
      envVars: ['LANGUAGELAYER_API_KEY']
    })
  }

  detectText (params = {}) {
    return this.request(`/detect`, `?${params}`)
  }

  request (endpoint, query = {}) {
    let apikey = `&access_key=${process.env.LANGUAGELAYER_API_KEY}`
    return axios.get(API_URL + endpoint + apikey + query)
      .then(res => res.json())
  }
}
