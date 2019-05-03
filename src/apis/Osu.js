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

  async getBeatmap (beatmap, mode, limit) {
    return this.request('/get_beatmaps', { b: beatmap, m: mode, limit }).then(data => {
      if (typeof data !== 'undefined' && data.length > 0) return data
      else return this.getBeatmapSet(beatmap, mode, limit)
    })
  }

  async getBeatmapSet (beatmapSet, mode, limit) {
    return this.request('/get_beatmaps', { s: beatmapSet, m: mode, limit }).then(u => u)
  }

  getBeatmapScores (beatmap, mode, limit) {
    return this.request('/get_scores', { b: beatmap, m: mode, limit }).then(u => u)
  }

  getUserTopScores (user, mode, limit) {
    return this.request('/get_user_best', { u: user, m: mode, limit }).then(u => u)
  }

  getUserRecentPlays (user, mode, limit) {
    return this.request('/get_user_recent', { u: user, m: mode, limit }).then(u => u)
  }

  getAccessToken (authCode) {
    return this.post('https://osu.ppy.sh/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.OSU_CLIENT_ID,
      client_secret: process.env.OSU_CLIENT_SECRET,
      redirect_uri: this.client.connections.osu.authCallbackURL,
      code: authCode
    }).then(u => u)
  }

  request (endpoint, queryParams = {}) {
    queryParams.k = process.env.OSU_API_KEY
    return snekfetch.get(`${API_URL}${endpoint}`)
      .query(queryParams)
      .then(r => r.body)
  }

  post (url, queryParams = {}) {
    return snekfetch.post(url)
      .query(queryParams)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .then(r => r.body)
  }
}
