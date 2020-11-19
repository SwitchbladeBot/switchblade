const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../../')

module.exports = class GooglePlayApp extends SearchCommand {
  constructor (client) {
    super({
      name: 'app',
      aliases: ['application', 'a'],
      parent: 'googleplay',
      embedColor: Constants.GOOGLEPLAY_COLOR,
      embedLogoURL: 'https://i.imgur.com/kLdJwcj.png'
    }, client)
  }

  async search (_, query) {
    return this.client.apis.gplaystore.searchApp(query)
  }

  searchResultFormatter (items) {
    return `[${items.title} - ${items.developer}](${items.url})`
  }

  async handleResult ({ t, channel, author, language }, { title, screenshots, installs, released, contentRating, genre, url, priceText, price, icon, summary, appId, developer, developerId, currency }) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setThumbnail(icon)
        .setAuthor(title, icon, url)
        .setDescription(summary.replace(/&amp;/g, '&'))
        .addField(t('commands:googleplay.developer'), `${developer} (${developerId})`, true)
        .addField(t('commands:googleplay.price'), priceText, true)
        .addField(t('commands:googleplay.genre'), genre, true)
        .addField(t('commands:googleplay.rating'), contentRating, true)
        .addField(t('commands:googleplay.installs'), installs, true)
        .addField(t('commands:googleplay.released'), released, true)
        .setImage(screenshots[Math.floor(Math.random() * screenshots.length)])
    )
  }
}
