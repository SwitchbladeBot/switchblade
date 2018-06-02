const YOUTUBE_VIDEO_ID_REGEX = /([a-zA-Z0-9_-]{11})/
const TWITCH_STREAM_NAME_REGEX = /^https?:\/\/(?:www\.|go\.)?twitch.tv\/([^/]+)$/
const SOUNDCLOUD_TRACK_URL_REGEX = /^(?:https?:\/\/|)(?:www\.|)(?:m\.|)soundcloud\.com\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_]+)(?:\\?.*|)$/

const YOUTUBE_PLAYLIST_REGEX = /list=((PL|LL|FL|UU)[a-zA-Z0-9_-]+)/

module.exports = class MusicUtils {
  static getSongSource (song) {
    const id = song.info.identifier
    const uri = song.info.uri

    if (YOUTUBE_VIDEO_ID_REGEX.test(id)) return 'youtube'
    if (TWITCH_STREAM_NAME_REGEX.test(id)) return 'twitch'
    if (SOUNDCLOUD_TRACK_URL_REGEX.test(uri)) return 'soundcloud'
  }

  static getPlaylistInfo (query) {
    if (YOUTUBE_PLAYLIST_REGEX.test(query)) {
      return { identifier: YOUTUBE_PLAYLIST_REGEX.exec(query)[1], source: 'youtube' }
    }
    return {}
  }

  static twitchUserLogin (url) {
    const regex = TWITCH_STREAM_NAME_REGEX.exec(url)
    if (regex) return regex[1]
  }
}

module.exports.SOURCE_NAMES = {
  youtube: 'YouTube',
  twitch: 'Twitch',
  soundcloud: 'SoundCloud'
}
