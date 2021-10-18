const {APIWrapper} = require('..')
const axios = require('axios')

const MEDIA_WHITE_LIST = ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFilm',
'tvShow', 'software', 'ebook', 'all']

module.exports = class ITunes extends APIWrapper {
  constructor() {
    super({name: 'itunes'})
  }

  async search(query) {
    query = query.split(" ")

    const media = query.at(0)
    
    var term = query.splice(1 , query.length - 2).join(" ")

    var country = query.splice(query.length - 1 , 1).join(" ")

    console.log(media , " - " , term , " - " , country)

    // Check if the country code is 2 letters 
    if(country.length != 2){
      term += " " + country

      country = "US"
    }

    if (!MEDIA_WHITE_LIST.includes(media)) {
      return [{
        'errorMessage':
            `Invaid term provided. The term has to be one of the following: ${
                MEDIA_WHITE_LIST.join(' , ')}`
      }]
    }

    console.log(media , term , country)

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
}