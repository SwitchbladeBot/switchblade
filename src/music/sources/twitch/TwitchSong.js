const { Song } = require('../../structures')
const MusicUtils = require('../../MusicUtils.js')
const Constants = require('../../../utils/Constants.js')

module.exports = class TwitchSong extends Song {
  constructor (data = {}, requestedBy, Twitch) {
    super(data, requestedBy)
    this._Twitch = Twitch
    this.color = Constants.TWITCH_COLOR
  }

  async loadInfo () {
    const tw = this._Twitch
    const userLogin = MusicUtils.twitchUserLogin(this.uri)
    const stream = await tw.getStreamByUsername(userLogin)
    if (stream) {
      const thumbnailUrl = stream.thumbnail_url.replace('{width}', '1920').replace('{height}', '1080')
      const user = await tw.getUser(stream.user_id)
      if (user) {
        this.artwork = user.profile_image_url
        this.richInfo = {
          viewerCount: stream.viewer_count,
          viewCount: user.view_count,
          description: user.description,
          offlineImage: user.offline_image_url,
          thumbnailUrl
        }
      } else {
        this.artwork = thumbnailUrl
        this.richInfo = { viewerCount: stream.viewer_count, thumbnailUrl }
      }
    }
    return this
  }

  get backgroundImage () {
    return this.richInfo.thumbnailUrl || this.artwork
  }
}
