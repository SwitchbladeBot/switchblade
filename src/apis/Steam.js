const { APIWrapper } = require('../')
const Steam = require('steamapi')

module.exports = class SteamAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'steam'
    this.envVars = ['STEAM_API_KEY']
  }

  load () {
    return new Steam(process.env.STEAM_API_KEY)
  }
}
