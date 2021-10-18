const {Command, SwitchbladeEmbed } = require('../..')
const axios = require('axios')

module.exports = class TasteDive extends Command {
  constructor(client) {
    super(
        {
          name: 'tastedive',
          parameters: [
            {
              type: 'string',
              full: false,
              clean: true,
              whitelist: ["music" , "movies" , "shows" , "podcasts" , "books" , "authors" , "games"],
              missingError: 'commands:tastedive.noText',
            },
            {
              type: 'string',
              full: true,
              clean: true,
            }
          ],
        },
        client)
  }

  async run({ channel }, type, liking) {
    const { data } = await axios.get(`https://tastedive.com/api/similar`, {
      params: {
        q: liking,
        type: type,
        limit: 10,
      }
    })
    
    const description = this.createDescription(data.Similar.Results)

    const embed =
        new SwitchbladeEmbed()
            .setColor(this.embedColor)
            .setTitle(type.toUpperCase() + ' - ' + liking.toUpperCase())
            .setDescription(description)

    channel.send(embed);
  }

  createDescription = (data) => {
    var description = ''

    var count = 1

    for (let key in data) {
      description += `\`${count < 10 ? '0' + count.toString() : count}\`:  *${data[key].Name}*\n`

      count += 1
    }

    if (count === 1) {
      description = 'Not Found'
    }

    return description
  }
}