const { SearchCommand, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class GooglePlayCommand extends SearchCommand {
  constructor (client) {
    super({
      name: 'googleplay',
      aliases: ['gplay', 'androidmarket'],
      requirements: { apis: ['gplaystore'] },
      embedColor: Constants.GOOGLEPLAY_COLOR,
      embedLogoURL: 'https://i.imgur.com/kLdJwcj.png'
    }, client)
  }

  async search (_, query) {
    return await this.client.apis.gplaystore.searchApp(query)
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
        .setDescription(summary)
        .addField(t('commands:googlePlay.developer'), `${developer} (${developerId})`, true)
        .addField(t('commands:googlePlay.price'), priceText, true)
        .addField(t('commands:googlePlay.genre'), genre, true)
        .addField(t('commands:googlePlay.rating'), contentRating, true)
        .addField(t('commands:googlePlay.installs'), installs, true)
        .addField(t('commands:googlePlay.released'), released, true)
        .setImage(screenshots[Math.floor(Math.random() * screenshots.length)])
    )
  }
}