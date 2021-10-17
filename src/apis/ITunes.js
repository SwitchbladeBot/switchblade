const { APIWrapper } = require('../')
const axios = require('axios')

module.exports = class ITunes extends APIWrapper {
    constructor () {
        super({
            name: 'itunes'
        })
    }

    async search (query) {
        query = query.split(" ")

        const media = query.at(0)

        const mediaWhiteList = ["movie", "podcast", "music", "musicVideo", "audiobook", "shortFilm", "tvShow", "software", "ebook", "all"]

        if(!mediaWhiteList.includes(media)){
            return [{"errorMessage": `Invaid term provided. The term has to be one of the following: ${mediaWhiteList.join(" , ")}`}]
        }

        const term = query.splice(1 , query.length - 1).join("+").toLowerCase()

        const userCountry = await this.getUserCountry()

        try{
            const { data } = await axios.get(`https://itunes.apple.com/search` , {
                params: {
                    media: media,
                    term: term,
                    country: userCountry,
                }
            })

            if(data.results == 0){
                throw new Error()
            }

            return data.results
        } catch{
            return [{"errorMessage": "No results found"}]
        }        
    }

    async getUserCountry() {
        const response = await axios.get("https://ipinfo.io")

        return response.data.country
    }
}
