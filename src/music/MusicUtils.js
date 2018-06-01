const YOUTUBE_VIDEO_ID_REGEX = /([a-zA-Z0-9_-]{11})/
const TWITCH_STREAM_NAME_REGEX = /^https?:\/\/(?:www\\.|go\\.)?twitch.tv\/([^/]+)$/
const SOUNDCLOUD_TRACK_URL_REGEX = /^(?:https?:\/\/|)(?:www\.|)(?:m\.|)soundcloud\.com\/([a-zA-Z0-9-_]+)\/([a-zA-Z0-9-_]+)(?:\\?.*|)$/

module.exports = class MusicUtils {
  static getSongSource (song) {
    const id = song.info.identifier
    const uri = song.info.uri

    if (YOUTUBE_VIDEO_ID_REGEX.test(id)) return 'youtube'
    if (TWITCH_STREAM_NAME_REGEX.test(id)) return 'twitch'
    if (SOUNDCLOUD_TRACK_URL_REGEX.test(uri)) return 'soundcloud'
    return 'http'
  }

  static twitchUserLogin (url) {
    const regex = TWITCH_STREAM_NAME_REGEX.exec(url)
    if (regex) return regex[1]
  }
}
