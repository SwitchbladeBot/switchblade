const { APIWrapper } = require('../')
const Nodesu = require('nodesu');

module.exports = class OsuAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'osu'
    this.envVars = ['OSU_API_KEY']
  }

  load () {
    return new Nodesu.Client(process.env.OSU_API_KEY);
  }
}
