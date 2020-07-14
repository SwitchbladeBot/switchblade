const { APIWrapper } = require('../')
const sinespApi = require('sinesp-api')

module.exports = class Sinesp extends APIWrapper {
  constructor () {
    super({
      name: 'sinesp'
    })
  }

  async searchPlate (plt) {
    try {
      return await sinespApi.search(plt)
    } catch (e) {
      return new Error('Not found')
    }
  }
}
