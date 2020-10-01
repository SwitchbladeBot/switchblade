const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'http://api.languagelayer.com'

module.exports = class LanguageLayerAPI extends APIWrapper {
  constructor () {
    super({
      name: 'languagelayer',
      envVars: ['LANGUAGELAYER_API_KEY']
    })
  }

  detectText (query) {
    return axios(`${API_URL}/detect`, {
      params: {
        access_key: process.env.LANGUAGELAYER_API_KEY,
        query
      }
    })
  }
}
