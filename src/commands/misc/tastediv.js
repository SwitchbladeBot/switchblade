const { Command, SwitchbladeEmbed } = require('../../')
const fetch = require("node-fetch")

module.exports = class TasteDiv extends Command {
    constructor(client) {
        super({
            name: 'tastediv',
            aliases: ['tastediv'],
            parameters: [{
                type: 'string',
                full: true,
                clean: true,
                missingError: 'commands:tastediv.noText'
            }]
        }, client)
    }

    async run({ channel, message }, text) {
        text = text.split(" ")

        const type = text.at(-1)

        const liking = text.splice(0 , text.length - 1).join(" ")

        const data = await fetch(`https://tastedive.com/api/similar?q=${liking}&type=${type}&limit=10`).then(res => res.json()).then(data => data)

        const description = this.createDescription(data)

        const embed = new SwitchbladeEmbed()
            .setColor(this.embedColor)
            .setTitle(type.toUpperCase() + ' - ' + liking.toUpperCase())
            .setDescription(description)

        channel.send(embed); 
    }

    createDescription = (data) => {
        var description = ""

        var count = 1

        for(let key in data["Similar"]["Results"]){
            description += `${count < 10 ? "0" + count.toString() : count}:  ${data["Similar"]["Results"][key].Name}\n`

            count += 1
        }

        if(count === 1){
            description = "Not Found"
        }

        return description
    }
}