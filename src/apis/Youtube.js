const { APIWrapper } = require('../')
const Youtube = require('youtube-api')
const { promisify } = require('util')

module.exports = class YoutubeAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'youtube'
    this.envVars = ['YOUTUBE_API_KEY']
  }

  load () {
    Youtube.authenticate({
      type: 'key',
      key: process.env.YOUTUBE_API_KEY
    })
    return this
  }

  async getVideoById (id, part = 'snippet, statistics') {
    const videoList = promisify(Youtube.videos.list)
    const [ video ] = (await videoList({ id, part })).items
    return video
  }

  getBestThumbnail (video) {
    if (!video || !video.snippet) return null
    const { medium, high, standard, maxres } = video.snippet.thumbnails
    return maxres || standard || high || medium || video.snippet.thumbnails['default']
  }
}
