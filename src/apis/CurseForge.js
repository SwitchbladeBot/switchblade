const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'https://addons-ecs.forgesvc.net/api/v2'

module.exports = class CurseForge extends APIWrapper {
  constructor () {
    super({
      name: 'curseforge'
    })
  }

  searchAddon (gameId, query) {
    return this.request('/addon/search', { gameId, pageSize: 3, searchFilter: query, sectionId: 4471, sort: 0 })
  }

  request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    return fetch(API_URL + endpoint + `?${qParams.toString()}`).then(res => res.json())
  }
}
