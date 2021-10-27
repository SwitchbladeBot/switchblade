const { SwitchbladeEmbed, Command} = require('../../')

const MEDIA_WHITE_LIST = ['music', 'movies', 'shows', 'podcasts', 'books', 'authors', 'games']
const formatNumber = (n) => Number(n) > 9 ? n : '0' + n

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

  async run ({ channel, t, message }, media, term) {
    const data = await this.client.apis.tastedive.search(media, term)

    channel.send(this.parseResponse(t, message.content, data))
  }

  parseResponse (t, title, data) {

    const description = data.map(([item, index]) => `\`${formatNumber(index)}\`:  *${item.Name}*`).join('\n')

    const embed = new SwitchbladeEmbed()
      .setTitle(t('commands:tastedive.title', { title }))
      .setDescription(description)

    return embed
  }
}
