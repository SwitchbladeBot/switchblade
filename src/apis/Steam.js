const { APIWrapper } = require('../')
const Steam = require('steamapi')

module.exports = class SteamAPI extends APIWrapper {
  constructor () {
    super({
      name: 'steam',
      envVars: ['STEAM_API_KEY']
    })
  }

  load () {
    return new Steam(process.env.STEAM_API_KEY)
  }
}
