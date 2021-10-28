const { APIWrapper } = require('../')
const axios = require('axios')

const endpoint = 'https://omgvamp-hearthstone-v1.p.rapidapi.com'

module.exports = class HearthStone extends APIWrapper {
  constructor() {
    super({
      name: 'hearthstone',
      envVars: ['HEARTHSTONE_RAPIDAPI_KEY']
    })
  }

  // Get Card by Name
  /**
   * @param {string} name the name of the card
   */

  async getCardByName(name) {
    const options = {
      method: 'GET',
      url: `${endpoint}/cards/${name}`,
      headers: {
        'x-rapidapi-host': `${endpoint}`,
        'x-rapidapi-key': `${process.env.HEARTHSTONE_RAPIDAPI_KEY}`
      }
    }
    return await axios(options)
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }

  // Get Card by Id
  /**
   * @param {int} id the integer of the card
   */

  async getCardById(id) {
    const options = {
      method: 'GET',
      url: `${endpoint}/cards/${id}`,
      headers: {
        'x-rapidapi-host': `${endpoint}`,
        'x-rapidapi-key': `${process.env.HEARTHSTONE_RAPIDAPI_KEY}`
      }
    }
    return await axios(options)
      .then((res) => res.data)
      .catch((err) => console.error(err))
  }
}
