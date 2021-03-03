const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://disease.sh/v3/covid-19'

module.exports = class Covid19 extends APIWrapper {
  constructor () {
    super({
      name: 'covid'
    })
  }

  async getCountry (country) {
    return this.request('countries', country)
  }

  async getCountryVaccine (country) {
    const vaccineData = await this.request('vaccine/coverage/countries', `${country}?lastdays=1`)
    return vaccineData.data
  }

  async getWorldwideVaccine () {
    const vaccineData = await this.request('vaccine/coverage', `?lastdays=1`)
    return vaccineData.data
  }

  async getWorldwide () {
    return this.request('all')
  }

  async getContinent (continents) {
    return this.request('continents', continents)
  }

  async getState (state) {
    return this.request('states', state)
  }

  request (endpoint, query = '') {
    return axios.get(encodeURI(`${API_URL}/${endpoint}/${query}`))
  }
}
