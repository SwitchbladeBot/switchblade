const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://mdn.almeidx.me/api'

module.exports = class MDN extends APIWrapper {
  constructor () {
    super({
      name: 'mdn'
    })
  }

  async search (name) {
    const res = await axios.get(`${API_URL}/search`, {
      params: {
        q: encodeURIComponent(name)
      }
    })
    return res.data
  }

  async getInfo (link) {
    const res = await axios.get(`${API_URL}/info`, {
      params: {
        l: link
      }
    })
    return res.data
  }
}
