const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://viacep.com.br/ws/'

module.exports = class ViaCEP extends APIWrapper {
  constructor () {
    super({
      name: 'viacep'
    })
  }

  async searchCEP (cep) {
          return this.request(cep)
  }

  // Default
  request (endpoint) {
    return fetch(`${API_URL}${endpoint}/json`)
      .then(res => res.json())
  }
}
