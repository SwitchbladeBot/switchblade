const { APIWrapper } = require('../')
const { google } = require('googleapis')

module.exports = class YoutubeAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'youtube'
    this.envVars = ['YOUTUBE_API_KEY']
  }

  load () {
    this.Youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    })
    return this
  }

  async getVideo (id, part = 'snippet, statistics') {
    const [ video ] = (await this.Youtube.videos.list({ id, part })).data.items
    return video
  }

  getBestThumbnail (video) {
    if (!video || !video.snippet) return null
    const { medium, high, standard, maxres } = video.snippet.thumbnails
    return maxres || standard || high || medium || video.snippet.thumbnails['default']
  }
}
