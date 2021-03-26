const { SongSource } = require('../../structures')

const DeezerPlaylist = require('./DeezerPlaylist.js')
const DeezerSong = require('./DeezerSong.js')

module.exports = class DeezerSongSource extends SongSource {
  static get customSources () {
    const albumHandler = ([, id], m, r) => this.provideAlbum(m, id, r)
    const playlistHandler = ([, id], m, r) => this.providePlaylist(m, id, r)
    const trackHandler = async ([, id], m, r) => this.provideTrack(m, id, r)
    return [
      [
        /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?track\/(\d+)/,
        trackHandler
      ],
      [
        /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?album\/(\d+)/,
        albumHandler
      ],
      [
        /^(?:https?:\/\/|)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?playlist\/(\d+)/,
        playlistHandler
      ]
    ]
  }

  static async providePlaylist (manager, id, requestedBy) {
    const playlist = await manager.client.apis.deezer.getPlaylist(id)
    if (!playlist) return

    const { tracks: { data } } = playlist
    const videos = (await Promise.all(data.map(track => this.provideTrack(manager, track, requestedBy)))).filter(i => !!i)
    return new DeezerPlaylist(playlist, videos, requestedBy).loadInfo()
  }

  static async provideAlbum (manager, id, requestedBy) {
    const album = await manager.client.apis.deezer.getAlbum(id)
    if (!album) return

    const { tracks: { data } } = album
    const videos = (await Promise.all(data.map((track) => this.provideTrack(manager, track, requestedBy, album)))).filter(i => !!i)
    return new DeezerPlaylist(album, videos, requestedBy).loadInfo()
  }

  static async provideTrack (manager, track, requestedBy, album) {
    if (typeof track === 'string') track = await manager.client.apis.deezer.getTrack(track)
    if (!track) return

    album = album || track.album
    const video = await this.getClosestVideo(manager, track)
    if (video) {
      try {
        const [song] = await manager.fetchTracks(video)
        return new DeezerSong(song, requestedBy, track, album).loadInfo()
      } catch (e) {
        manager.client.logError(e)
      }
    }
  }

  static async getClosestVideo ({ client }, track) {
    return super.getClosestVideo(client, `${track.artist.name} - ${track.title}`)
  }
}
