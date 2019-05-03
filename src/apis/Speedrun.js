const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://www.speedrun.com/api/v1'
const USER_AGENT = 'Switchblade-Discord-Bot'

module.exports = class Speedrun extends APIWrapper {
  constructor () {
    super()
    this.name = 'speedrun'
  }

  getGame (endpoint, query) {
    return this.request(`/games/${query}${endpoint ? `/${endpoint}` : ''}`).then(u => u.data)
  }

  getRun (game) {
    return this.request(`/runs`, { game }).then(u => u.data)
  }

  getUser (user) {
    return this.request(`/users/${user}`).then(u => u.data)
  }

  getLeaderboard (game, category) {
    return this.request(`/leaderboards/${game}/category/${category}`).then(u => u.data)
  }

  getPlatform (platform) {
    return this.request(`/platforms/${platform}`).then(u => u.data)
  }

  getRegion (region) {
    return this.request(`/regions/${region}`).then(u => u.data)
  }

  request (endpoint) {
    return snekfetch.get(API_URL + endpoint)
      .set('User-Agent', USER_AGENT)
      .then(r => r.body)
  }
}
