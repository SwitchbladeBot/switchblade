const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://registry.npmjs.org/-/v1/search'

module.exports = class NPMRegistry extends APIWrapper {
  constructor () {
    super({
      name: 'npmregistry'
    })
  }

  async search (name) {
    return axios({
      params: {
        text: encodeURIComponent(name),
        size: 10
      },
      url: API_URL
    })
  }
}
