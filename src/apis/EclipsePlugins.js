const { APIWrapper } = require('..')
const axios = require('axios')
const parser = require('xml2json')

const API_URL = 'https://marketplace.eclipse.org/api/p/search/apachesolr_search'

module.exports = class EclipsePlugins extends APIWrapper {
  constructor () {
    super({
      name: 'eclipseplugins'
    })
  }

  async search (name) {
    const res = await axios({
      params: {
        page_num: 1
      },
      url: `${API_URL}/${encodeURIComponent(name)}`,
      method: 'POST'
    })

    return JSON.parse(parser.toJson(res.data))
  }
}
