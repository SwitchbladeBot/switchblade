const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://api.github.com'

module.exports = class GitHubAPI extends APIWrapper {
  constructor () {
    super({
      name: 'github',
      envVars: ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET']
    })
  }

  getUser (username) {
    return this.request(`/users/${username}`).then(res => res)
  }

  findRepositories (repository, maxValues) {
    return this.request('/search/repositories', { q: repository, per_page: maxValues }).then(res => res && res.items)
  }

  getUserRepositories (username) {
    return this.request(`/users/${username}/repos`).then(res => res)
  }

  getOrganizationRepositories (organization) {
    return this.request(`/orgs/${organization}/repos`).then(res => res)
  }

  getOrganizationMembers (organization) {
    return this.request(`/orgs/${organization}/members`).then(res => res && res.length)
  }

  getRepository (repoOwner, repoName) {
    return this.request(`/repos/${repoOwner}/${repoName}`).then(res => res)
  }

  getOrganization (organization) {
    return this.request(`/orgs/${organization}`).then(res => res)
  }

  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return fetch(`${API_URL}${endpoint}?client_id=${process.env.GITHUB_CLIENT_ID}$&client_secret=${process.env.GITHUB_CLIENT_SECRET}&${qParams.toString()}`)
      .then(res => res.json())
  }
}
