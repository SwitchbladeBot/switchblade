const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://flathub.org/api/v1/apps'

module.exports = class FlatHub extends APIWrapper {
  constructor () {
    super({
      name: 'flathub'
    })
  }

  async list () {
    return fetch(API_URL).then(r => r.json())
  }

  async getApp (appId) {
    return fetch(`${API_URL}/${appId}`).then(r => r.json())
  }

  async search (query) {
    return fetch(`${API_URL}/search/${query}`).then(r => r.json())
  }
}
