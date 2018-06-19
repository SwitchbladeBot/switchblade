const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../index')
const { Command, CommandParameters, StringParameter } = CommandStructures
const gplay = require('google-play-scraper')

module.exports = class PlayStore extends Command {
  constructor (client) {
    super(client)

    this.name = 'playstore'
    this.aliases = ['googleplay', 'gplay']
    this.parameters = new CommandParameters(this,
      new StringParameter({missingError: 'errors:noCountryCode'}),
      new StringParameter({full: true, missingError: 'errors:noAppName'})
    )
  }

  async run ({t, author, channel, language}, country, term) {
    channel.startTyping()
    console.log(term)
    const embed = new SwitchbladeEmbed(author)
    const response = await gplay.search({term, country, num: 1, lang: language.substring(0, 1)})
    if (response.length > 0) {
      const app = response[0]
      embed
        .setColor(0x518FF5)
        .setThumbnail('http://' + app.icon)
        .setAuthor('Google Play Store', 'https://i.imgur.com/tkTq2bi.png')
        .setDescription([
          `**[${app.title}](${app.url})**`,
          app.summary,
          '',
          MiscUtils.ratingToStarEmoji(app.score),
          app.priceText
        ].join('\n'))
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('errors:appNotFound'))
    }
    channel.send(embed).then(() => channel.stopTyping())
  }
}
