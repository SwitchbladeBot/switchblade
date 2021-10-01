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
      name: 'consultaplaca',
      envVars: ['PLATE_API_URL']
    })
  }

  async searchPlate (placa) {
    const firstRequest = await this.request('consultas', placa.replace('-', '')).then(res => res.data)
    const secondRequest = await axios.get(`${Buffer.from(process.env.PLATE_API_URL, 'base64')}${placa}/json`).then(res => res.data)
    return (firstRequest.modelo === 'Sem Dados') ? firstRequest : secondRequest
  }

  request (endpoint, query = '') {
    return axios.get(encodeURI(`${API_URL}/${endpoint}/${query}/${process.env.KEYCONSULTA}`), {
      httpsAgent: agent
    })
  }
}
