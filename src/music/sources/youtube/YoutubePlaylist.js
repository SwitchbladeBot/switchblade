const { Playlist } = require('../../structures')
const YoutubeSong = require('./YoutubeSong.js')

const PLAYLIST_URI = 'https://www.youtube.com/playlist?list='

module.exports = class YoutubePlaylist extends Playlist {
  constructor (data = {}, songs = [], requestedBy, Youtube) {
    super(data, songs, requestedBy)

    this.uri = PLAYLIST_URI + this.identifier
    this._Youtube = Youtube
  }

  async loadInfo () {
    const yt = this._Youtube
    // Load songs
    this.songs = await Promise.all(this.songs.map(s => new YoutubeSong(s, this.requestedBy, yt).loadInfo()))

    // Load playlist
    const playlist = await yt.getPlaylist(this.identifier)
    if (playlist) {
      this.title = playlist.snippet.title
      this.description = playlist.snippet.description
      this.artwork = yt.getBestThumbnail(playlist.snippet.thumbnails).url
    } else {
      return null
    }
    return this
  }
}
