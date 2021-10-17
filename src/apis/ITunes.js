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

        if(!["movie", "podcast", "music", "musicVideo", "audiobook", "shortFilm", "tvShow", "software", "ebook", "all"].includes(media)){
            return [{"errorMessage": `Invaid term provided. The term has to be one of the following: ${["movie", "podcast", "music", "musicVideo", "audiobook", "shortFilm", "tvShow", "software", "ebook", "all"].join(" , ")}`}]
        }

        const term = query.splice(1 , query.length - 1).join("+").toLowerCase()

        const userCountry = await this.getUserCountry()

        try{
            const { data } = await axios.get(`https://itunes.apple.com/search?media=${media}&term=${term}&limit=10&country=${userCountry}`)

            if(data.results == 0){
                throw new TypeError()
            }

            return data.results
        } catch{
            return [{"errorMessage": "No results found"}]
        }        
    }

    getUserCountry = async () => {
        const response = await axios.get("https://ipinfo.io")

        return response.data.country
    }
}
