const { Song } = require('../../structures')
const Constants = require('../../../utils/Constants.js')

module.exports = class SpotifySong extends Song {
  constructor (data = {}, requestedBy, track, album = track.album) {
    super(data, requestedBy)

    this.identifier = track.id
    this.author = track.artists.map(a => a.name).join(', ')
    this.title = track.name
    this.uri = track.external_urls.spotify

    if (album) {
      const [cover] = album.images.sort((a, b) => b.width - a.width)
      this.artwork = cover.url
    }

    this.source = 'spotify'
    this.color = Constants.SPOTIFY_COLOR

    this.spotifyTrack = track
  }
}
