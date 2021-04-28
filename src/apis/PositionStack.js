const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'http://api.positionstack.com/v1'

module.exports = class PositionStack extends APIWrapper {
  constructor () {
    super({
      name: 'positionstack',
      envVars: ['PS_ACCESS_KEY']
    })
  }

  async getAddress (city, options) {
    options = Object.assign({ query: city, limit: 1, output: 'json', timezone_module: 1 }, options)
    return this.request('forward', city, options)
  }

  request (endpoint, query, queryParams = '') {
    const qParams = new URLSearchParams(queryParams)
    return axios.get(encodeURI(`${API_URL}/${endpoint}?access_key=${process.env.PS_ACCESS_KEY}&${qParams.toString()}`))
      .then(res => res.data)
  }
}
