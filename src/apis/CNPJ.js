const { APIWrapper } = require('../')
const axios = require('axios')

module.exports = class CNPJAPI extends APIWrapper {
  constructor () {
    super({
      name: 'cnpj'
    })
  }

  async getCNPJ (query) {
    return axios.get(`https://www.receitaws.com.br/v1/cnpj/${query}`).then(res => res.data)
  }
}
