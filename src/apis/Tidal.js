const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://listen.tidal.com/v1'
const RESOURCES_URL = 'https://resources.tidal.com/'

module.exports = class TidalAPI extends APIWrapper {
  constructor () {
    super({
      name: 'tidal',
      envVars: [ 'TIDAL_TOKEN' ]
    })
  }

  search (query, types = 'ARTISTS,ALBUMS,TRACKS,VIDEOS,PLAYLISTS', limit = 10, countryCode = 'US') {
    return this.request('/search', {
      query, types, limit, countryCode
    })
  }

  getAlbumCoverUrl (coverId, size = 640) {
    return `${RESOURCES_URL}/images/${coverId.replace(/-/g, '/')}/${size}x${size}.jpg`
  }

  async request (endpoint, query = {}) {
    const queryParameters = new URLSearchParams(query)
    return fetch(API_URL + endpoint + `?${queryParameters.toString()}`, {
      headers: {
        'x-tidal-token': process.env.TIDAL_TOKEN
      }
    }).then(res => res.json())
  }
}
