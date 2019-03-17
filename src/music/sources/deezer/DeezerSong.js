const { Song } = require('../../structures')
const Constants = require('../../../utils/Constants.js')

module.exports = class DeezerSong extends Song {
  constructor (data = {}, requestedBy, track, album = track.album) {
    super(data, requestedBy)

    this.identifier = track.id
    this.author = track.artist.name
    this.title = track.title
    this.uri = track.link

    if (album) this.artwork = album.cover_xl

    this.source = 'deezer'
    this.color = Constants.DEEZER_COLOR

    this.deezerTrack = track
  }
}
