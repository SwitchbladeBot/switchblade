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

  getVideo (id, part = 'snippet,statistics') {
    return this.Youtube.videos.list({ id, part }).then(r => r && r.data.items[0])
  }

  getPlaylist (id, part = 'snippet') {
    return this.Youtube.playlists.list({ id, part }).then(r => r && r.data.items[0])
  }

  getBestThumbnail (thumbnails) {
    if (!thumbnails) return {}
    const { high, maxres, medium, standard } = thumbnails
    return maxres || high || medium || standard || thumbnails['default']
  }

  searchVideos (query, part = 'snippet', maxResults = 5) {
    return this.Youtube.search.list({ q: query, type: 'video', part, maxResults }).then(r => r.data)
  }
}
