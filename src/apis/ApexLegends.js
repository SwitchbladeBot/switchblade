const { APIWrapper } = require('../')
const snekfetch = require('snekfetch')

const API_URL = 'https://public-api.tracker.gg/apex/v1/standard/profile/'

module.exports = class ApexAPI extends APIWrapper {
  constructor () {
    super()
    this.name = 'apexlegends'
    this.envVars = ['APEX_LEGENDS_API_KEY']
  }

  getPlayer (platform, player) {
    const endpoint = `${platform}/${player}`
    return this.request(endpoint)
  }

  request (endpoint) {
    console.log(`${API_URL}${endpoint}`)
    return snekfetch.get(`${API_URL}${endpoint}`, { headers: { 'TRN-Api-Key': process.env.APEX_LEGENDS_API_KEY } }).then(resolve => resolve.body).catch(reject => reject.body)
  }
}
