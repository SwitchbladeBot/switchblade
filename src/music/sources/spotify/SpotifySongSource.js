const { SongSource } = require('../../structures')

const SpotifyPlaylist = require('./SpotifyPlaylist.js')
const SpotifySong = require('./SpotifySong.js')

const SPOTIFY_TRACK_URL_REGEX = /^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/track\/([a-zA-Z\d-_]+)/
const SPOTIFY_ALBUM_URL_REGEX = /^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com\/album\/([a-zA-Z\d-_]+)/
const SPOTIFY_PLAYLIST_URL_REGEX = /^(?:https?:\/\/|)?(?:www\.)?open\.spotify\.com(?:\/user\/[a-zA-Z\d-_]+)?\/playlist\/([a-zA-Z\d-_]+)/

module.exports = class SpotifySongSource extends SongSource {
  static test (identifier) {
    return SPOTIFY_TRACK_URL_REGEX.test(identifier) || SPOTIFY_ALBUM_URL_REGEX.test(identifier) || SPOTIFY_PLAYLIST_URL_REGEX.test(identifier)
  }

  static async provide (manager, identifier, requestedBy) {
    try {
      if (SPOTIFY_TRACK_URL_REGEX.test(identifier)) {
        const [ , trackID ] = SPOTIFY_TRACK_URL_REGEX.exec(identifier)
        const track = await manager.client.apis.spotify.getTrack(trackID)
        return this.provideTrack(manager, track, requestedBy)
      } else if (SPOTIFY_ALBUM_URL_REGEX.test(identifier)) {
        const [ , albumID ] = SPOTIFY_ALBUM_URL_REGEX.exec(identifier)
        const album = await manager.client.apis.spotify.getAlbum(albumID)
        return this.provideAlbum(manager, album, requestedBy)
      } else if (SPOTIFY_PLAYLIST_URL_REGEX.test(identifier)) {
        const [ , playlistID ] = SPOTIFY_PLAYLIST_URL_REGEX.exec(identifier)
        const playlist = await manager.client.apis.spotify.getPlaylist(playlistID)
        return this.providePlaylist(manager, playlist, requestedBy)
      }
    } catch (e) {
      return null
    }
    return null
  }

  static async providePlaylist (manager, playlist, requestedBy) {
    const { items } = await manager.client.apis.spotify.getPlaylistTracks(playlist.id)
    const videos = (await Promise.all(items.map(({ track }) => this.provideTrack(manager, track, requestedBy)))).filter(i => !!i)
    return new SpotifyPlaylist(playlist, videos, requestedBy).loadInfo()
  }

  static async provideAlbum (manager, album, requestedBy) {
    const { items } = await manager.client.apis.spotify.getAlbumTracks(album.id)
    const videos = (await Promise.all(items.map((track) => this.provideTrack(manager, track, requestedBy, album)))).filter(i => !!i)
    return new SpotifyPlaylist(album, videos, requestedBy).loadInfo()
  }

  static async provideTrack (manager, track, requestedBy, album = track.album) {
    const video = await this.getClosestVideo(manager, track)
    if (video) {
      try {
        const [ song ] = await manager.fetchTracks(video.id.videoId)
        return new SpotifySong(song, requestedBy, track, album).loadInfo()
      } catch (e) {
        console.error(e)
        return null
      }
    }
  }

  static async getClosestVideo ({ client }, track) {
    const { items: [ item ] } = await client.apis.youtube.searchVideos(`${track.artists[0].name} - ${track.name}`)
    return item
  }
}
