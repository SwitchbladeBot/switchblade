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

  async getAddress (city) {
    return this.request('forward', city).then(res => res.data)
  }

  request (endpoint, query = '') {
    return axios.get(encodeURI(`${API_URL}/${endpoint}?query=${query}&access_key=${process.env.PS_ACCESS_KEY}&limit=1&output=json`))
  }
}
