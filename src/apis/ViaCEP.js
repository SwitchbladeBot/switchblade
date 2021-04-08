const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://viacep.com.br/ws/'

module.exports = class ViaCEP extends APIWrapper {
  constructor () {
    super({
      name: 'viacep'
    })
  }

  // Default
  searchCEP (cep) {
    return fetch(`${API_URL}${cep}/json`)
      .then(res => res.json())
  }
}
