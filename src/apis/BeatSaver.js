const { APIWrapper, CommandError } = require('../')
const axios = require('axios')

const API_URL = 'https://beatsaver.com/api'

module.exports = class BeatSaverAPI extends APIWrapper {
  constructor () {
    super({
      name: 'beatsaver'
    })
  }

  getMapDetails (key) {
    return this.request(`/maps/detail/${key}`)
  }

  searchMaps (q) {
    return this.request(`/search/text/0`, { q, automapper: 1 }).then(r => r.docs)
  }

  async request (endpoint, queryParams = {}) {
    const qParams = new URLSearchParams(queryParams)
    const response = await axios.get(API_URL + endpoint + `?${qParams.toString()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
        'accept': 'application/json'
      }
    }).catch(()=>{
      throw new CommandError(t('errors:generic'));
    });

    return response.data;
  }
}
