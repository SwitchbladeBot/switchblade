const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://nodejs.org/api'

module.exports = class Node extends APIWrapper {
  constructor () {
    super({
      name: 'node'
    })
  }

  async search (name) {
    const res = await axios.get(`${API_URL}/`, {
      params: {
        q: encodeURIComponent(name)
      }
    })
    return res.data
  }

  async getInfo (link) {
    const res = await axios.get(`${API_URL}/`, {
      params: {
        l: link
      }
    })
    return res.data
  }
}