const { SwitchbladeEmbed, SearchCommand, Constants, CommandStructures } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures
const moment = require("moment")

module.exports = class Itunes extends SearchCommand {
    constructor(client) {
        super({
            name: "itunes",
            requirements: {
                apis: ["itunes"]
            },
            embedColor: Constants.ITUNES_COLOR,
            embedLogoURL: "https://i.imgur.com/mwPUlYA.png",
        } , client);
    }
    
    async search(_ , query){
        const data = await this.client.apis.itunes.search(query)

        return await data;
    }

    searchResultFormatter(i) {
        if(!i.error){
            return `[${i.trackName}](${i.trackViewUrl}) - [${i.artistName}](${i.artistViewUrl})`
        } else {
            return i.error
        }
    }

    getRatingEmojis (rating) {
        return (this.getEmoji('ratingstar', '⭐').repeat(Math.floor(rating))) + (this.getEmoji('ratinghalfstar').repeat(Math.ceil(rating - Math.floor(rating))))
    }

    async handleResult({ t, author, channel }, data){
        if(data.errorMessage){
            const embed = new SwitchbladeEmbed(author)
                .setColor(Constants.ERROR_COLOR)
                .setTitle(data.errorMessage)

            channel.send(embed)

            return 
        } 


        const stars = this.getRatingEmojis(data.averageUserRating)

        const embed = new SwitchbladeEmbed(author)
            .setColor(this.embedColor)
            .setAuthor(t('commands:itunes.place'), this.embedLogoURL, 'https://www.apple.com/itunes/')
            .setURL(data.trackViewUrl)
            .setTitle(t("commands:itunes.track" , {name: data.trackName, artistName: data.artistName}))
            .setThumbnail(data.artworkUrl100)
            .setDescriptionFromBlockArray([
            [
                data.description ? `Description: ${data.description.replace(new RegExp('<[^>]*>' , 'g') , "")}` : data.longDescription ? `Description: ${data.longDescription}` :  ""
            ],
            [
                data.userRatingCount ? t('commands:itunes.ratingCount', { count: data.userRatingCount || 0}) : "",
                data.averageUserRating ? `Rating: ${stars} (${Math.round(data.averageUserRating) || ""})`: ""
            ],
            [
                t("commands:itunes.price" , {price: data.formattedPrice || data.trackPrice , currency: data.currency})
            ],
            [
                t("commands:itunes.release" , {date: moment(data.releaseDate).format("DD/MM/YYYY")})
            ],
            [
                `Genres: ${(data.genres || ["-"]).join(" , ")}`
            ]
        ])

        channel.send(embed)
    }
}