const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://corona.lmao.ninja/v2'

module.exports = class Covid19 extends APIWrapper {
  constructor () {
    super({
      name: 'covid'
    })
  }

  async getCountry (country) {
    return this.request('countries', country)
  }

  async getWorldwide () {
    return this.request('all')
  }

  request (endpoint, query = '') {
    return axios.get(encodeURI(`${API_URL}/${endpoint}/${query}`))
  }
}
