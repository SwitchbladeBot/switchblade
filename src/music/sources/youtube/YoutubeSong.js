const { Song } = require('../../structures')
const Constants = require('../../../utils/Constants.js')

module.exports = class YoutubeSong extends Song {
  constructor (data = {}, requestedBy, Youtube) {
    super(data, requestedBy)
    this._Youtube = Youtube
    this.color = Constants.YOUTUBE_COLOR
  }

  async loadInfo () {
    const yt = this._Youtube
    const video = await yt.getVideo(this.identifier)
    if (video) {
      const { viewCount, likeCount, dislikeCount, favoriteCount, commentCount } = video.statistics

      this.artwork = yt.getBestThumbnail(video.snippet.thumbnails).url
      this.richInfo = { viewCount, likeCount, dislikeCount, favoriteCount, commentCount }
    }
    return this
  }
}
