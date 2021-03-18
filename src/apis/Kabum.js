const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://servicespub.prod.api.aws.grupokabum.com.br'

module.exports = class Kabum extends APIWrapper {
  constructor () {
    super({
      name: 'kabum'
    })
  }

  async getSuggestion (product) {
    return this.request('listagem/v1/autocomplete?string=', product).then(r => r.data.produtos)
  }

  async getProduct (productId) {
    return this.request('descricao/v1/descricao/produto/', productId).then(r => r.data)
  }

  request (endpoint, query = '') {
    return axios.get(encodeURI(`${API_URL}/${endpoint}${query}`), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0'
      }
    })
  }
}
