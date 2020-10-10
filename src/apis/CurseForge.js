const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://addons-ecs.forgesvc.net/api/v2'

module.exports = class CurseForge extends APIWrapper {
  constructor () {
    super({
      name: 'curseforge'
    })
  }

  async searchAddon (gId, query) {
    return axios({
      params: {
        gameId: gId,
        pageSize: 3,
        searchFilter: query,
        sectionId: 4471,
        sort: 0
      },
      url: `${API_URL}/addon/search`
    })
  }
}
