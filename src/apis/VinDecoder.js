const { APIWrapper } = require('../')
const axios = require('axios')

module.exports = class VinDecoderAPI extends APIWrapper {
  constructor () {
    super({
      name: 'vindecoder'
    })
  }

  async getVIN (query) {
    return axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${query}?format=json`).then(res => res.data)
  }
}
