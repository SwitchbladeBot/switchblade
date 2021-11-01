const { APIWrapper } = require('..')
const axios = require('axios')

module.exports = class ITunes extends APIWrapper {
  constructor () {
    super({ name: 'itunes' })
  }

  async search (media, term, country) {
    try{
      const { data } = await axios.get('https://itunes.apple.com/search', {
        params: {
          media,
          term,
          country,
          limit: 10
        }
      })

      return [data.results , true]
    } catch {
      return [[] , false]
    }
  }
}
