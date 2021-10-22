const { APIWrapper } = require('..')
const axios = require('axios')

module.exports = class TasteDive extends APIWrapper {
  constructor () {
    super({ name: 'tastedive' })
  }

  async search (type, q) {
    try {
      const { data } = await axios.get('https://tastedive.com/api/similar', {
        params: {
          type,
          q,
          limit: 10
        }
      })

      if (data.results === 0) {
        throw new Error()
      }

      return data.Similar.Results
    } catch (err) {
      return []
    }
  }
}
