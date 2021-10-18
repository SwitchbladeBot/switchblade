const {APIWrapper} = require('../')
const axios = require('axios')

module.exports = class ITunes extends APIWrapper {
  constructor() {
    super({name: 'itunes'})
  }

  async search(media , term , country) {
    const mediaWhiteList =
        [
          'movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFilm',
          'tvShow', 'software', 'ebook', 'all'
        ]

        if (!mediaWhiteList.includes(media)) {
      return [{
        'errorMessage':
            `Invaid term provided. The term has to be one of the following: ${
                mediaWhiteList.join(' , ')}`
      }]
    }

    try {
      const {data} = await axios.get(`https://itunes.apple.com/search`, {
        params: {
          media: media,
          term: term,
          country: country,
          limit: 10,
        }
      })

      if (data.results == 0) {
        throw new Error()
      }

      return data.results
    } catch {
      return [{'errorMessage': 'No results found'}]
    }
  }

  async getUserCountry() {
    const response = await axios.get('https://ipinfo.io')

    return response.data.country
  }
}