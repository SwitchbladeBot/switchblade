const { APIWrapper } = require('../')
const Fortnite = require('fortnite-api')

module.exports = class SpotifyAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'fortnite'
    this.envVars = ['FORTNITE_EMAIL', 'FORTNITE_PASSWORD', 'FORTNITE_LAUNCHER_TOKEN', 'FORTNITE_CLIENT_TOKEN']
  }

  async load () {
    const api = new Fortnite(
      [
        process.env.FORTNITE_EMAIL,
        process.env.FORTNITE_PASSWORD,
        process.env.FORTNITE_LAUNCHER_TOKEN,
        process.env.FORTNITE_CLIENT_TOKEN
      ]
    )
    await api.login()
    return api
  }
}
