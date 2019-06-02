const { APIWrapper } = require('../')
const SteamLadder = require('steamladder')

module.exports = class SteamLadderAPI extends APIWrapper {
  constructor () {
    super({
      name: 'steamladder',
      envVars: ['STEAM_LADDER_API_KEY']
    })
    this.name = 'steamladder'
    this.envVars = ['STEAM_LADDER_API_KEY']
  }

  load () {
    return new SteamLadder(process.env.STEAM_LADDER_API_KEY)
  }
}
