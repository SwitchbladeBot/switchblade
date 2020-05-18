const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://hub.docker.com/api'
const FRONTEND_URL = 'https://hub.docker.com'

module.exports = class DockerHubAPI extends APIWrapper {
  constructor () {
    super({
      name: 'dockerhub'
    })
  }

  search (query) {
    return Promise.all([
      this.request('/content/v1/products/search', {
        image_filter: 'community',
        q: query,
        page_size: 10
      }),
      this.request('/content/v1/products/search', {
        source: 'community',
        q: query,
        page_size: 10
      })
    ]).then(responses => responses.flat())
  }

  // TODO: Check if this works
  getRepositoryUrl (repository) {
    if (repository.source === 'community') {
      return `${FRONTEND_URL}/${repository.slug || repository.name}`
    } else {
      return `${FRONTEND_URL}/_/${repository.slug}`
    }
  }

  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`).then(res => res.json()).then(json => json.summaries)
  }
}
