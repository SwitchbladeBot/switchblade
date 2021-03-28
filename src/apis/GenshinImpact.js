const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://api.genshin.dev'

module.exports = class GenshinImpact extends APIWrapper {
  constructor () {
    super({
      name: 'genshinimpact'
    })
  }

  async getCharacter (character) {
    return this.request('characters', character).then(res => res.data)
  }

  request (endpoint, query = '') {
    return axios.get(encodeURI(`${API_URL}/${endpoint}/${query}`))
  }
}
