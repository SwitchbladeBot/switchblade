const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://api.tumblr.com/v2'

module.exports = class TumblrAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'tumblr'
    this.envVars = ['TUMBLR_API_KEY']
  }

  /**
   * Get an array of 20 first posts with images
   * @param blog {String} The tumblr blog url
   * @param params {Object}
   */
  getPhotoPosts (blog, params = {}) {
    return this.request(`/blog/${blog}/posts/photo`, params)
  }
  // Default
  request (endpoint, queryParams = {}) {
    queryParams.api_key = process.env.TUMBLR_API_KEY
    return snekfetch.get(`${API_URL}${endpoint}`).query(queryParams).then(r => r.body)
  }
}
