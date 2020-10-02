const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'http://www.portaltransparencia.gov.br/api-de-dados'

module.exports = class PortalDaTransparencia extends APIWrapper {
  constructor () {
    super({
      name: 'portaldatransparencia',
      envVars: ['TRANSPARENCIA_KEY']
    })
  }

  searchAuxilioCPF (cpf) {
    return this.request('/auxilio-emergencial-por-cpf-ou-nis', { codigoBeneficiario: cpf })
  }

  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`, {
      headers: { 'chave-api-dados': process.env.TRANSPARENCIA_KEY }
    }).then(res => res.json())
  }
}
