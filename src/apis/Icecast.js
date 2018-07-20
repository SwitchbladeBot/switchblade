const { APIWrapper } = require('../')
const IcecastParser = require('icecast-parser')

module.exports = class Icecast extends APIWrapper {
  constructor () {
    super()
    this.name = 'icecast'
  }

  fetchMetadata (url) {
    return new Promise((resolve, reject) => {
      const station = new IcecastParser(url)
      station.on('metadata', resolve)
      station.on('error', reject)
      station.on('empty', reject)
    })
  }
}
