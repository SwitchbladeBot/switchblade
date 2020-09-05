const { APIWrapper } = require('../')
const axios = require('axios')

const API_URL = 'https://chorus.fightthe.pw/api'

module.exports = class ChorusAPI extends APIWrapper {
  constructor () {
    super({
      name: 'chorus'
    })
  }

  search (query) {
    return this.request('/search', { query }).then(r => r.songs)
  }

  async request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)

    const response = await axios.get(API_URL + endpoint + `?${qParams.toString()}`).catch(()=>{
      throw new CommandError(t('errors:generic'));
    });

    return response.data;

  }
}
