const { APIWrapper } = require('../')
const Spotify = require('node-spotify-api')

module.exports = class SpotifyAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'spotify'
    this.envVars = ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET']
  }

  load () {
    return new Spotify({
      id: process.env.SPOTIFY_CLIENT_ID,
      secret: process.env.SPOTIFY_CLIENT_SECRET
    })
  }
}
