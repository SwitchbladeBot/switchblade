const { Playlist } = require('../../structures')

module.exports = class DeezerPlaylist extends Playlist {
  constructor (data = {}, songs = [], requestedBy) {
    super(data, songs, requestedBy)

    this.identifier = data.id
    this.uri = data.link
    this.title = data.title

    this.source = 'deezer'
  }

  loadInfo () {
    return this
  }
}
