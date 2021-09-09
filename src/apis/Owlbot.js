const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://owlbot.info/api/v4'

module.exports = class OwlbotAPI extends APIWrapper {
  constructor () {
    super({
      name: 'owlbot',
      envVars: ['OWLBOT_KEY']
    })
  }

  request (query) {
    return axios({
      url: `${API_URL}/dictionary/${encodeURIComponent(query)}`,
      headers: { Authorization: `Token ${process.env.OWLBOT_KEY}` }
    })
  }
}
