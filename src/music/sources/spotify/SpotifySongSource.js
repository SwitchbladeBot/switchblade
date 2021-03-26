const { SongSource } = require('../../structures')

const SpotifyPlaylist = require('./SpotifyPlaylist.js')
const SpotifySong = require('./SpotifySong.js')

module.exports = class SpotifySongSource extends SongSource {
  static get customSources () {
    const albumHandler = ([, id], m, r) => this.provideAlbum(m, id, r)
    const playlistHandler = ([, id], m, r) => this.providePlaylist(m, id, r)
    const trackHandler = async ([, id], m, r) => {
      const track = await m.client.apis.spotify.getTrack(id)
      return this.provideTrack(m, track, r)
    }

    return [
      [
        [/^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/track\/([a-zA-Z\d-_]+)/, /spotify:track:([a-zA-Z\d-_]+)$/],
        trackHandler
      ],
      [
        [/^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/album\/([a-zA-Z\d-_]+)/, /spotify:album:([a-zA-Z\d-_]+)$/],
        albumHandler
      ],
      [
        [/^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com(?:\/user\/[a-zA-Z\d-_]+)?\/playlist\/([a-zA-Z\d-_]+)/, /^spotify(?::user:[a-zA-Z\d-_]+)?:playlist:([a-zA-Z\d-_]+)/],
        playlistHandler
      ]
    ]
  }

  static async providePlaylist (manager, id, requestedBy) {
    const playlist = await manager.client.apis.spotify.getPlaylist(id)
    if (!playlist) return

    const { items } = await manager.client.apis.spotify.getPlaylistTracks(playlist.id)
    const videos = (await Promise.all(items.map(({ track }) => this.provideTrack(manager, track, requestedBy)))).filter(i => !!i)
    return new SpotifyPlaylist(playlist, videos, requestedBy).loadInfo()
  }

  static async provideAlbum (manager, id, requestedBy) {
    const album = await manager.client.apis.spotify.getAlbum(id)
    if (!album) return

    const { items } = await manager.client.apis.spotify.getAlbumTracks(album.id)
    const videos = (await Promise.all(items.map((track) => this.provideTrack(manager, track, requestedBy, album)))).filter(i => !!i)
    return new SpotifyPlaylist(album, videos, requestedBy).loadInfo()
  }

  static async provideTrack (manager, track, requestedBy, album = track.album) {
    const video = await this.getClosestVideo(manager, track)
    if (video) {
      try {
        const [song] = await manager.fetchTracks(video)
        return new SpotifySong(song, requestedBy, track, album).loadInfo()
      } catch (e) {
        manager.client.logError(e)
      }
    }
  }

  static getClosestVideo ({ client }, track) {
    return super.getClosestVideo(client, `${track.artists[0].name} - ${track.name}`)
  }
}
