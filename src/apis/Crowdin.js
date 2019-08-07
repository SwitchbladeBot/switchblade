const { APIWrapper } = require('../')
const Crowdin = require('crowdin-without-vulnerability')

module.exports = class CrowdinAPI extends APIWrapper {
  constructor () {
    super({
      name: 'crowdin',
      envVars: ['CROWDIN_API_KEY', 'CROWDIN_PROJECT_ID']
    })
  }

  load () {
    return new Crowdin({
      apiKey: process.env.CROWDIN_API_KEY,
      endpointUrl: `https://api.crowdin.net/api/project/${process.env.CROWDIN_PROJECT_ID}`
    })
  }
}
