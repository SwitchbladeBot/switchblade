const { Playlist } = require('../../structures')

module.exports = class SpotifyPlaylist extends Playlist {
  constructor (data = {}, songs = [], requestedBy) {
    super(data, songs, requestedBy)

    this.identifier = data.id
    this.uri = data.external_urls.spotify
    this.title = data.name

    this.source = 'spotify'
  }

  loadInfo () {
    return this
  }
}
