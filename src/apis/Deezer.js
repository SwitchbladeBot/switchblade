const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://api.deezer.com'

module.exports = class DeezerAPI extends APIWrapper {
  constructor () {
    super({
      name: 'deezer'
    })
  }

  // Get
  getTrack (id) {
    return this.request(`/track/${id}`)
  }

  getAlbum (id) {
    return this.request(`/album/${id}`)
  }

  getArtist (id) {
    return this.request(`/artist/${id}`)
  }

  getArtistAlbums (id, limit = 10) {
    return this.request(`/artist/${id}/albums`, { limit })
  }

  getArtistRelated (id) {
    return this.request(`/artist/${id}/related`)
  }

  getPlaylist (id) {
    return this.request(`/playlist/${id}`)
  }

  getUserFollowers (id) {
    return this.request(`/user/${id}/followers`)
  }

  getUserFollowings (id) {
    return this.request(`/user/${id}/followings`)
  }

  getUserChart (id, chart = 'artists') {
    return this.request(`/user/${id}/charts/${chart}`)
  }

  getPodcastEpisodes (id) {
    return this.request(`/podcast/${id}/episodes`)
  }

  // Search
  findTracks (q) {
    return this.request('/search', { q })
  }

  findAlbums (q) {
    return this.request('/search/album', { q })
  }

  findArtists (q) {
    return this.request('/search/artist', { q })
  }

  findPlaylists (q) {
    return this.request('/search/playlist', { q })
  }

  findPodcasts (q) {
    return this.request('/search/podcast', { q })
  }

  findUser (q) {
    return this.request('/search/user', { q })
  }

  // Default
  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`)
      .then(res => res.json())
  }
}
