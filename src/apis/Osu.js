const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://osu.ppy.sh/api'

module.exports = class Osu extends APIWrapper {
  constructor () {
    super()
    this.name = 'osu'
    this.envVars = ['OSU_API_KEY']
  }

  getUser (user, mode) {
    return this.request('/get_user', { u: user, m: mode }).then(u => u[0])
  }

  request (endpoint, queryParams = {}) {
    queryParams.k = process.env.OSU_API_KEY
    return snekfetch.get(`${API_URL}${endpoint}`)
      .query(queryParams)
      .then(r => r.body)
  }
}
