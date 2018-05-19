const { APIWrapper } = require('../')
const Spotify = require('node-spotify-api')

module.exports = class SpotifyAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'spotify'
  }

  initialize () {
    return new Spotify({
      id: process.env.SPOTIFY_CLIENT_ID,
      secret: process.env.SPOTIFY_CLIENT_SECRET
    })
  }
}
