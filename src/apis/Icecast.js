const { APIWrapper } = require('../')
const IcecastParser = require('icecast-parser')

module.exports = class Icecast extends APIWrapper {
  constructor () {
    super({
      name: 'icecast'
    })
  }

  fetchMetadata (url) {
    return new Promise((resolve, reject) => {
      if (url.startsWith('https://')) return reject(new Error('HTTPS'))
      try {
        const station = new IcecastParser(url)
        station.on('metadata', resolve)
        station.on('error', reject)
        station.on('empty', reject)
      } catch (e) {
        reject(e)
      }
    })
  }
}
