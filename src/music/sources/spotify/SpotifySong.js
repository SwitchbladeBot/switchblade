const { Song } = require('../../structures')

module.exports = class SpotifySong extends Song {
  constructor (data = {}, requestedBy, track, album = track.album) {
    super(data, requestedBy)

    this.identifier = track.id
    this.author = track.artists.map(a => a.name).join(', ')
    this.title = track.name
    this.uri = track.external_urls.spotify

    const [ cover ] = album.images.sort((a, b) => b.width - a.width)
    this.artwork = cover.url

    this.source = 'spotify'
    this.color = '#1DB954'

    this.spotifyTrack = track
  }
}
