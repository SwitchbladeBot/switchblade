const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://dictionaryapi.com/api/v3/references/collegiate/json'

module.exports = class MerriamWebster extends APIWrapper {
  constructor () {
    super({
      name: 'merriamwebster',
      envVars: ['MERRIAM_WEBSTER_API_KEY']
    })
  }

  async search (word) {
    return axios({
      url: `${API_URL}/${encodeURIComponent(word)}`,
      params: {
        key: process.env.MERRIAM_WEBSTER_API_KEY
      }
    })
  }
}
