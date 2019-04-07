// Song regex
const HTTP_STREAM_REGEX = /^(icy|https?):\/\/(.*)$/
const YOUTUBE_VIDEO_ID_REGEX = /([a-zA-Z0-9_-]{11})/
const TWITCH_STREAM_NAME_REGEX = /^https?:\/\/(?:www\.|go\.)?twitch\.tv\/([^/]+)$/
const SOUNDCLOUD_TRACK_URL_REGEX = /^(?:https?:\/\/|)(?:www\.|m\.|)soundcloud\.com\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_]+)(?:\\?.*|)$/
const MIXER_STREAM_REGEX = /^https?:\/\/(?:www\.)?beam\.pro\/([^/]+)$/

// Playlist regex
const YOUTUBE_PLAYLIST_REGEX = /list=((RD|PL|LL|FL|UU)[a-zA-Z0-9_-]+)/

module.exports = class MusicUtils {
  static getSongSource (song) {
    const id = song.info.identifier
    const uri = song.info.uri

    if (TWITCH_STREAM_NAME_REGEX.test(id)) return 'twitch'
    if (SOUNDCLOUD_TRACK_URL_REGEX.test(uri)) return 'soundcloud'
    if (HTTP_STREAM_REGEX.test(id)) return 'http'
    if (YOUTUBE_VIDEO_ID_REGEX.test(id)) return 'youtube'
    if (MIXER_STREAM_REGEX.test(uri)) return 'mixer'
  }

  static getPlaylistInfo (query) {
    if (YOUTUBE_PLAYLIST_REGEX.test(query)) {
      return { identifier: YOUTUBE_PLAYLIST_REGEX.exec(query)[1], source: 'youtube' }
    }
    return {}
  }

  static twitchUserLogin (url) {
    const regex = TWITCH_STREAM_NAME_REGEX.exec(url)
    return regex ? regex[1] : null
  }
}

module.exports.SOURCE_NAMES = {
  youtube: 'YouTube',
  twitch: 'Twitch',
  soundcloud: 'SoundCloud'
}
