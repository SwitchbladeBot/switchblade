const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures
const itunesSearchApi = require('itunes-search-api')

module.exports = class AppStore extends Command {
  constructor (client) {
    super(client)

    this.name = 'appstore'
    this.parameters = new CommandParameters(this,
      new StringParameter({full: false, missingError: 'errors:noCountryCode'}),
      new StringParameter({full: false, missingError: 'errors:noAppName'})
    )
  }

  async run ({t, author, channel}, country, appName) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const response = await itunesSearchApi(appName, {query: {entity: 'software', limit: 1, country: country.toUpperCase()}})
    if (response.body.resultCount > 0) {
      const app = response.body.results[0]
      console.log(app)
      embed
        .setURL(app.trackViewUrl)
        .setThumbnail(app.artworkUrl60)
        .setAuthor('App Store', 'https://i.imgur.com/yki1FZs.jpg')
        .setDescription([
          `**[${app.trackName}](${app.trackViewUrl})**`,
          app.genres.join(', '),
          '',
          MiscUtils.ratingToStarEmoji(app.averageUserRating),
          `**${MiscUtils.formatBytes(app.fileSizeBytes)}** - ${getPriceString(app, t)}`
        ].join('\n'))
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:appNotFound'))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}

function getPriceString (app, t) {
  if (app.price === 0) {
    return t('commons:free')
  } else {
    return app.formattedPrice
  }
}

function ratingToStarEmoji (rating) {
  return '<:ratingstar:458381544357101580>'.repeat(Math.floor(rating)) + ((rating % 1).toFixed(1) !== 0 ? '<:ratinghalfstar:458381544571273224>' : '')
}

function formatBytes (a, b) {
  if (a === 0) return '0 Bytes'
  const c = 1024
  const d = b || 2
  const e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const f = Math.floor(Math.log(a) / Math.log(c))
  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}
