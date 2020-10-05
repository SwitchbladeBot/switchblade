const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://packagist.org/search.json'

module.exports = class Packagist extends APIWrapper {
  constructor () {
    super({
      name: 'packagist'
    })
  }

  async search (name) {
    return axios({
      params: {
        q: encodeURIComponent(name)
      },
      url: API_URL
    })
  }
}
