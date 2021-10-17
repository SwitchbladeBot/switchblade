const { APIWrapper } = require('../')
const axios = require('axios')

const ID_API_URL = 'https://www.flightradar24.com/v1/search/web/find'
const AIRCRAFT_API_URL = 'https://data-live.flightradar24.com/clickhandler/?version=1.5'

module.exports = class FlightRadar extends APIWrapper {
  constructor () {
    super({
      name: 'flightradar'
    })
  }

  async findId (flightNum) {
    return axios.get(ID_API_URL, {
      params: {
        query: flightNum,
        limit: 1
      }
    }).then(res => res.data)
  }

  async searchAircraft (flightNum) {
    const { results } = await this.findId(flightNum)
    if (!results?.[0].id) return undefined
    return axios.get(AIRCRAFT_API_URL, {
      params: {
        flight: results[0].id
      }
    }).then(res => res.data)
  }
}
