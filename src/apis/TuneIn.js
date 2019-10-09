const { APIWrapper } = require('../')
var TuneIn = require('node-tunein-radio')

module.exports = class TuneInAPI extends APIWrapper {
  constructor () {
    super({
      name: 'tunein'
    })

    this.tunein = new TuneIn()
  }

  search (keyword) {
    return this.tunein.search(keyword).then(r => r.body)
  }

  describeRadio (id, nowPlaying = false) {
    return this.tunein.describe(id, nowPlaying).then(r => r.body[0])
  }
}
