const { APIWrapper } = require('..')
const axios = require('axios')

const API_URL = 'https://plugins.jetbrains.com/api'

module.exports = class JetBrainsPlugins extends APIWrapper {
  constructor () {
    super({
      name: 'jetbrainsplugins'
    })
  }

  async search (name) {
    return axios({
      params: {
        excludeTags: 'theme',
        max: 10,
        offset: 0,
        search: encodeURIComponent(name)
      },
      url: `${API_URL}/searchPlugins`
    })
  }

  async getPluginInfo (id) {
    const res = await axios(`${API_URL}/plugins/${id}`)
    return res.data
  }

  async getPluginVersion (id) {
    const res = await axios(`${API_URL}/plugins/${id}/updates?channel=&size=1`)
    return res.data
  }
}
