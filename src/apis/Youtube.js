const { APIWrapper } = require('../')
const { google } = require('googleapis')

module.exports = class YoutubeAPI extends APIWrapper {
  constructor () {
    super({
      name: 'youtube',
      envVars: ['YOUTUBE_API_KEY']
    })
  }

  load () {
    this.Youtube = google.youtube({
      version: 'v3',
      auth: process.env.YOUTUBE_API_KEY
    })
    return this
  }

  getVideos (ids, part = 'snippet,statistics') {
    return this.Youtube.videos.list({ id: ids.join(), part }).then(r => r && r.data.items)
  }

  getVideo (id, part = 'snippet,statistics') {
    return this.getVideos([id], part).then(r => r && r[0])
  }

  getChannels (ids, part = 'snippet,statistics') {
    return this.Youtube.channels.list({ id: ids.join(), part }).then(r => r && r.data.items)
  }

  getChannel (id, part = 'snippet,statistics') {
    return this.getChannels([id], part).then(r => r && r[0])
  }

  getPlaylist (id, part = 'snippet') {
    return this.Youtube.playlists.list({ id, part }).then(r => r && r.data.items[0])
  }

  getBestThumbnail (thumbnails) {
    if (!thumbnails) return {}
    const { high, maxres, medium, standard } = thumbnails
    return maxres || high || medium || standard || thumbnails.default
  }

  searchVideos (query, part = 'snippet', maxResults = 5) {
    return this.search(query, ['video'], part, 'relevance', maxResults)
  }

  search (query, type = ['video', 'channel', 'playlist'], part = 'snippet', order = 'relevance', maxResults = 5) {
    return this.Youtube.search.list({ q: query, type: type.join(), part, order, maxResults }).then(r => r.data)
  }
}
