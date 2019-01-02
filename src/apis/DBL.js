const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://discordbots.org/api'

module.exports = class TwitchAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'dbl'
    this.envVars = ['DBL_TOKEN']
  }

  checkVote (botId, userId) {
    return this.request(`/bots/${botId}/check`, { userId }).then(res => res.voted === 1)
  }

  request (endpoint, queryParams = {}) {
    return snekfetch.get(`${API_URL}${endpoint}`)
      .query(queryParams)
      .set({ 'Authorization': process.env.DBL_TOKEN })
      .then(r => r.body)
  }
}
