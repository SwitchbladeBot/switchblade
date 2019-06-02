const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://haveibeenpwned.com/api/v2'
const USER_AGENT = 'Switchblade-Discord-Bot'

module.exports = class HIBP extends APIWrapper {
  constructor () {
    super({
      name: 'hibp'
    })
  }

  getBreaches (query) {
    return this.request(`/breachedaccount/${encodeURI(query)}`).then(u => u)
  }

  getPastes (query) {
    return this.request(`/pasteaccount/${encodeURI(query)}`).then(u => u)
  }

  request (endpoint) {
    return fetch(API_URL + endpoint, {
      headers: { 'User-Agent': USER_AGENT }
    }).then(res => res.json())
  }
}
