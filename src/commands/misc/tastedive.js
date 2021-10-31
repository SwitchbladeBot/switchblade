const { SwitchbladeEmbed, Command} = require('../../')

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
          missingError: 'commands:tastedive.notFound' 
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
    const description = data.map((item, index) => `\`${String(index).padStart(2, '0')}\`:  *${item.Name}*`).join('\n')

    const embed = new SwitchbladeEmbed()
      .setTitle(t('commands:tastedive.title', { title }))
      .setDescription(description)

    return embed
  }
}
