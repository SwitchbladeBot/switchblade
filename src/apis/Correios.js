const { APIWrapper } = require('../')
const { rastro } = require('rastrojs')

module.exports = class Correios extends APIWrapper {
  constructor () {
    super({
      name: 'correios'
    })
  }

  // Default
  trackCode (tCode) {
    return rastro.track(tCode)
  }
}
