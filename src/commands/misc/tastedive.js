const { SwitchbladeEmbed, Command } = require('../../')
const axios = require('axios')

const MEDIA_WHITE_LIST = ['music', 'movies', 'shows', 'podcasts', 'books', 'authors', 'games']

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
          full: true
        }
      ]
    }, client)
  }

  async run ({ channel }, type, liking) {
    const { data } = await axios.get('https://tastedive.com/api/similar', {
      params: {
        q: liking,
        type,
        limit: 10
      }
    })

    const description = this.createDescription(data.Similar.Results)

    const embed =
        new SwitchbladeEmbed()
          .setColor(this.embedColor)
          .setTitle(type.toUpperCase() + ' - ' + liking.toUpperCase())
          .setDescription(description)

    channel.send(embed)
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
