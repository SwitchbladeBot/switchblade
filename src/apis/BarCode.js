const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://api.upcdatabase.org'

module.exports = class UPCBarcodeAPI extends APIWrapper {
  constructor () {
    super({
      name: 'barcode',
      envVars: [ 'UPC_BARCODE_KEY' ]
    })
  }

  request (query) {
    return axios({
      url: `${API_URL}/product/${encodeURIComponent(query)}/?apikey=${process.env.UPC_BARCODE_KEY}`
    })
  }
}
