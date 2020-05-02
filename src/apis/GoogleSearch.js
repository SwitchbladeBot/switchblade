const { APIWrapper } = require('../')
const fetch = require('node-fetch')

module.exports = class CrowdinAPI extends APIWrapper {
  constructor () {
    super({
      name: 'gsearch',
      envVars: ['G_CSE_CREDENTIALS', 'G_CSE_ID']
    })
  }

  async search (query) {
    return fetch(`https://www.googleapis.com/customsearch/v1?q=${query}&key=${process.env.G_CSE_CREDENTIALS}&cx=${process.env.G_CSE_ID}&safe=active`)
      .then(r => r.json())
  }

  async searchImage (query) {
    return fetch(`https://www.googleapis.com/customsearch/v1?q=${query}&key=${process.env.G_CSE_CREDENTIALS}&cx=${process.env.G_CSE_ID}&safe=active&searchType=image`)
      .then(r => r.json())
  }
}
