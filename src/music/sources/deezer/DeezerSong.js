const { Song } = require('../../structures')

module.exports = class DeezerSong extends Song {
  constructor (data = {}, requestedBy, track, album = track.album) {
    super(data, requestedBy)

    this.identifier = track.id
    this.author = track.artist.name
    this.title = track.title
    this.uri = track.link

    if (album) this.artwork = album.cover_xl

    this.source = 'deezer'
    this.color = '#00C7F2'

    this.deezerTrack = track
  }
}
