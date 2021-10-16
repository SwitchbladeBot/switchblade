const { Command, SwitchbladeEmbed, SearchCommand } = require('../../')
const fetch = require("node-fetch")

module.exports = class Itunes extends Command {
    constructor(client) {
        super({
            name: 'itunes',
            aliases: ['itunes'],
            parameters: [{
                type: 'string',
                full: true,
                clean: true,
                missingError: 'commands:itunes.noText'
            }]
        }, client)
    }

    async run({ channel, message }, text) {
        text = text.split(" ")

        const media = text.at(0)

        const term = text.splice(1 , text.length - 1).join(" ")

        const data = await fetch(`https://itunes.apple.com/search?media=${media}&term=${term}&limit=10`).then(res => res.json()).then(data => data)

        const description = this.createDescription(data)

        const embed = new SwitchbladeEmbed()
            .setColor(this.embedColor)
            .setTitle(media.toUpperCase() + ' - ' + term.toUpperCase())
            .setDescription(description)

        channel.send(embed); 
    }

    createDescription = (data) => {
        var description = ""

        var count = 1

        for(let key in data.results){
            description += `${count < 10 ? "0" + count.toString() : count}: [${data.results[key].trackName}](${data.results[key].trackViewUrl}) - [${data.results[key].artistName}](${data.results[key].artistViewUrl})\n`

            count += 1
        }

        if(count === 1){
            description = "Not Found"
        }

        return description
    }
}