const { APIWrapper } = require('../')
const axios = require('axios')
const https = require('https')

const API_URL = 'https://apicarros.com/v2'

const agent = new https.Agent({
  rejectUnauthorized: false
})

module.exports = class ConsultaPlaca extends APIWrapper {
  constructor () {
    super({
      name: 'consultaplaca'
    })
  }

  async searchPlate (placa) {
    return this.request('consultas', placa.replace('-', '')).then(res => res.data)
  }

  request (endpoint, query = '') {
    return axios.get(encodeURI(`${API_URL}/${endpoint}/${query}/${process.env.KEYCONSULTA}`), {
      httpsAgent: agent
    })
  }
}
