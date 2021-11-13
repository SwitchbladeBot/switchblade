const { APIWrapper } = require('../')
const axios = require('axios')

module.exports = class BingImages extends APIWrapper {
  constructor () {
    super({
      name: 'bingimages',
      envVars: ['BING_API_KEY']
    })
  }

  async searchImage (query) {
    return axios.get('https://api.bing.microsoft.com/v7.0/images/search', {
      params: {
        q: query
      },
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
      }
    }).then(res => res.data.value[0].contentUrl)
  }
}
