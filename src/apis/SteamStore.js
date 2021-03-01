const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://store.steampowered.com/api'

module.exports = class SteamStore extends APIWrapper {
  constructor () {
    super({
      name: 'steamstore'
    })
  }

  search (query) {
    return axios({
      url: `${API_URL}/storesearch`,
      params: {
        term: query,
        l: 'english',
        cc: 'US'
      }
    })
  }

  info (id, lang = 'english') {
    return axios({
      url: `${API_URL}/appdetails`,
      params: {
        appids: id,
        l: lang
      }
    })
  }
}
