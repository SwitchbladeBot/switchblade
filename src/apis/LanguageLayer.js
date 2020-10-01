const { APIWrapper } = require('../')
const fetch = require('node-fetch')

const API_URL = 'http://api.languagelayer.com/'

module.exports = class TumblrAPI extends APIWrapper {
    constructor() {
        super({
            name: 'languagelayer',
            envVars: ['LANGUAGELAYER_API_KEY']
        })
    }

    detectText(params = {}) {
        return this.request(`/detect`, `?${params}`)
    }

    request(endpoint, query = {}) {
        let apikey = `&access_key=${process.env.LANGUAGELAYER_API_KEY}`
        return fetch(API_URL + endpoint + apikey + query)
            .then(res => res.json())
    }
}