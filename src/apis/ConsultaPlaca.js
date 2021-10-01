const { APIWrapper } = require('../')
const axios = require('axios')
const https = require('https')

const API_URL = 'https://apicarros.com/v2/consultas'

const agent = new https.Agent({
  rejectUnauthorized: false
})

module.exports = class ConsultaPlaca extends APIWrapper {
  constructor () {
    super({
      name: 'consultaplaca',
      envVars: ['PLATE_API_URL', 'KEYCONSULTA']
    })
  }

  async searchPlate (placa) {
    const firstRequest = await this.request(API_URL, `${placa.replace('-', '')}/${process.env.KEYCONSULTA}`)
    const secondRequest = await this.request(`${Buffer.from(process.env.PLATE_API_URL, 'base64')}`, `${placa}/json`)
    return (firstRequest.modelo !== 'Sem Dados') ? firstRequest : secondRequest
  }

  request (url, query = '') {
    return axios.get(encodeURI(`${url}/${query}`), {
      httpsAgent: agent
    }).then(res => res.data)
  }
}
