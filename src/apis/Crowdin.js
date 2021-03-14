const { APIWrapper } = require('../')
const axios = require('axios')
const unzip = require('unzip')

const BASE_URL = 'https://api.crowdin.net/api/project/'

module.exports = class CrowdinAPI extends APIWrapper {
  constructor () {
    super({
      name: 'crowdin',
      envVars: ['CROWDIN_API_KEY', 'CROWDIN_PROJECT_ID']
    })
  }

  download () {
    return this.request('/download/all.zip')
  }

  async downloadToStream (stream) {
    return new Promise(async (resolve, reject) => {
      await this.download()
        .then(res => {
          res.data.pipe(stream)
            .on('error', reject)
            .on('close', resolve)
            .on('end', resolve)
        })
    })
  }

  downloadToPath (path) {
    return this.downloadToStream(unzip.Extract({ path }))
  }

  async request (endpoint) {
    return axios({
      method: 'GET',
      url: BASE_URL + process.env.CROWDIN_PROJECT_ID + endpoint + `?key=${process.env.CROWDIN_API_KEY}`,
      responseType: 'stream'
    })
  }
}
