const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://haveibeenpwned.com/api/v2'
const USER_AGENT = 'Switchblade-Discord-Bot'

module.exports = class HIBP extends APIWrapper {
  constructor () {
    super()
    this.name = 'hibp'
  }

  getBreaches (query) {
    return this.request(`/breachedaccount/${encodeURI(query)}`).then(u => u)
  }

  getPastes (query) {
    return this.request(`/pasteaccount/${encodeURI(query)}`).then(u => u)
  }

  request (endpoint) {
    return snekfetch.get(API_URL + endpoint)
      .set('User-Agent', USER_AGENT)
      .then(r => r.body)
  }
}
