const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures
const itunesSearchApi = require('itunes-search-api')

module.exports = class AppStore extends Command {
  constructor (client) {
    super(client)

    this.name = 'appstore'
    this.parameters = new CommandParameters(this,
      new StringParameter({missingError: 'errors:noCountryCode'}),
      new StringParameter({full: true, missingError: 'errors:noAppName'})
    )
  }

  async run ({t, author, channel}, country, appName) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    const response = await itunesSearchApi(appName, {query: {entity: 'software', limit: 1, country: country.toUpperCase()}})
    if (response.body.resultCount > 0) {
      const app = response.body.results[0]
      embed
        .setColor(0x1B9BF6)
        .setURL(app.trackViewUrl)
        .setThumbnail(app.artworkUrl60)
        .setAuthor('App Store', 'https://i.imgur.com/1MJCm1X.jpg')
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
