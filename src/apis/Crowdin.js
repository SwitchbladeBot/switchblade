const { APIWrapper } = require('../')
const axios = require('axios')
const Zip = require('adm-zip')

const BASE_URL = 'https://api.crowdin.net/api/project/'

module.exports = class CrowdinAPI extends APIWrapper {
  constructor () {
    super({
      name: 'crowdin',
      envVars: ['CROWDIN_API_KEY', 'CROWDIN_PROJECT_ID']
    })
  }

  async downloadToPath (path) {
    const { data } = await this.request('/download/all.zip')

    const zip = new Zip(data)
    zip.extractAllTo(path, true)
  }

  async request (endpoint) {
    return axios({
      method: 'GET',
      url: BASE_URL + process.env.CROWDIN_PROJECT_ID + endpoint + `?key=${process.env.CROWDIN_API_KEY}`,
      responseType: 'arraybuffer'
    })
  }
}
