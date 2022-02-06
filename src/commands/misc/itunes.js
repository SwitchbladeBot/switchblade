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
        name: 'country',
        required: true,
        missingError: 'commands:itunes.notFound'
      }, {
        type: 'string',
        full: true,
        name: 'term',
        required: true,
        missingError: 'commands:itunes.notFound'
      }]
    },
    client)
  }

  async run ({ t, author, message, channel }, media, country, term) {
    term = term.replaceAll(' ', '+')

    const [data, response] = await this.client.apis.itunes.search(media, term, country)

    if (!response) {
      throw new CommandError(t('commands:itunes.invalidTerm'))
    }

    if (data.length === 0) {
      throw new CommandError(t('commands:itunes.noResults'))
    }

    channel.send(this.parseResponse(author, t, data, message.content))
  }

  searchResultFormatter (i) {
    return `[${i.trackName}](${i.trackViewUrl}) - [${i.artistName}](${i.artistViewUrl})`
  }

  getRatingEmojis (rating) {
    return (this.getEmoji('ratingstar', '⭐').repeat(Math.floor(rating))) +
            (this.getEmoji('ratinghalfstar')
              .repeat(Math.ceil(rating - Math.floor(rating))))
  }

  parseResponse (author, t, data, title) {
    const description = data.map((item, index) => `\`${String(index).padStart(2, '0')}\`: ${this.searchResultFormatter(item)}`)

    return new SwitchbladeEmbed(author)
      .setThumbnail(this.embedUrl)
      .setDescription(description)
      .setColor(Constants.ITUNES_COLOR)
      .setTitle(t('commands:itunes.title', { title }))
  }
}
