const { SwitchbladeEmbed, Command, Constants, CommandError } = require('../../')

const MEDIA_WHITE_LIST = ['movie', 'podcast', 'music', 'musicVideo', 'audiobook', 'shortFilm', 'tvShow', 'software', 'ebook', 'all']

module.exports = class Itunes extends Command {
  constructor (client) {
    super({
      name: 'itunes',
      requirements: { apis: ['itunes'] },
      embedLogoURL: 'https://i.imgur.com/U4jjk5F.png',
      parameters: [{
        type: 'string',
        full: false,
        name: 'media',
        whitelist: MEDIA_WHITE_LIST,
        missingError: 'commands:itunes.notFound',
        required: true
      }, {
        type: 'string',
        full: true,
        name: 'term',
        required: true
      }, {
        type: 'string',
        full: false,
        name: 'country',
        required: false
      }]
    },
    client)
  }

  async run (context, media, term, country = 'US') {
    const data = Array.from(await this.client.apis.itunes.search(media, term, country))

    if(data.length == 0){
      throw new CommandError(context.t("commands:itunes.noResults"))
    }

    this.parseResponse(context, data, context.message.content)
  }

  searchResultFormatter (i) {
    return `[${i.trackName}](${i.trackViewUrl}) - [${i.artistName}](${i.artistViewUrl})`
  }

  getRatingEmojis (rating) {
    return (this.getEmoji('ratingstar', '⭐').repeat(Math.floor(rating))) +
            (this.getEmoji('ratinghalfstar')
              .repeat(Math.ceil(rating - Math.floor(rating))))
  }

  async parseResponse ({ channel, author, t }, data, title) {
    const description = data.map((item, index) => `\`${String(index).padStart(2, '0')}\`: ${this.searchResultFormatter(item)}`)

    const embed = new SwitchbladeEmbed(author)
      .setThumbnail(this.embedUrl)
      .setDescription(description)
      .setColor(Constants.ITUNES_COLOR)
      .setTitle(t('commands:itunes.title', { title }))

    channel.send(embed)
  }
}
