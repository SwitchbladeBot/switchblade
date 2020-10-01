const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://flathub.org/api/v1/apps'

module.exports = class FlatHub extends APIWrapper {
  constructor () {
    super({
      name: 'flathub'
    })
  }

  async list () {
    const res = await axios(API_URL)
    return res.data
  }

  async getApp (appId) {
    const res = await axios({ baseURL: API_URL, url: `/${appId}` })
    return res.data
  }

  async search (query) {
    const res = await axios({ baseURL: API_URL, url: `/search/${query}` })
    return res.data
  }
}
