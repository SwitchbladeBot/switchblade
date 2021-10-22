const { SwitchbladeEmbed, Command } = require('../../')

const MEDIA_WHITE_LIST = ['music', 'movies', 'shows', 'podcasts', 'books', 'authors', 'games']

// module.exports = class TasteDive extends Command {
//   constructor (client) {
//     super({
//       name: 'tastedive',
//       // requirements: { apis: ['tastedive'] },
//       parameters: [{
//         type: 'string',
//         full: false,
//         name: 'media',
//         whitelist: MEDIA_WHITE_LIST,
//         missingError: "Error",
//         required: true
//       }, {
//         type: 'string',
//         full: true,
//         name: 'term',
//         required: true
//       }]
//     },
//     client)

//     this.embedUrl = 'https://i.imgur.com/mwPUlYA.png'
//   }

//   async run (context, name , term) {
//     // this.author = context.author

//     // const data = await this.client.apis.itunes.search(media, term, country)

//     // this.parseResponse(context, await data, context.message.content)
//   }

//   searchResultFormatter (i) {
//     return `[${i.trackName}](${i.trackViewUrl}) - [${i.artistName}](${i.artistViewUrl})`
//   }

//   getRatingEmojis (rating) {
//     return (this.getEmoji('ratingstar', '⭐').repeat(Math.floor(rating))) +
//             (this.getEmoji('ratinghalfstar')
//               .repeat(Math.ceil(rating - Math.floor(rating))))
//   }

//   async parseResponse ({ channel, author, t }, data, title) {
//     let description = ''

//     let index = 1

//     const formatNumber = (n) => Number(n) > 9 ? n : '0' + n

//     for (const item of data) {
//       description += `\`${formatNumber(index)}\`: ${this.searchResultFormatter(item)} \n`

//       index++
//     }

//     const embed = new SwitchbladeEmbed(author)
//       .setThumbnail(this.embedUrl)
//       .setDescription(description)
//       .setTitle(t('commands:itunes.title', { title: title }))

//     channel.send(embed)
//   }
// }

module.exports = class TasteDive extends Command {
  constructor (client) {
    super({
      name: 'tastedive',
      requirements: { apis: ['tastedive'] },
      parameters: [
        {
          type: 'string',
          full: false,
          whitelist: MEDIA_WHITE_LIST,
          missingError: ({ t, prefix }) => {
            return new SwitchbladeEmbed()
              .setTitle(t('commands:tastedive.noMedia'))
              .setDescription([
                this.usage(t, prefix),
                '',
                `__**${t('commands:tastedive.availableMedia')}:**__`,
                `**${MEDIA_WHITE_LIST.map(l => `\`${l}\``).join(', ')}**`
              ].join('\n'))
          }
        }, {
          type: 'string',
          full: true,
        }
      ]
    }, client)
  }

  async run({ channel }, type, liking) {
    const { data } = await axios.get(`https://tastedive.com/api/similar`, {
      params: {
        q: liking,
        type,
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

  parseResponse (t, title, data) {
    const formatNumber = (n) => Number(n) > 9 ? n : '0' + n

    let description = ''

    let index = 1

    for (const key in data) {
      description += `\`${formatNumber(index)}\`:  *${data[key].Name}*\n`

      index += 1
    }

    const embed = new SwitchbladeEmbed()
      .setTitle(t('commands:tastedive.title', { title: title }))
      .setDescription(description)

    return embed
  }
}
