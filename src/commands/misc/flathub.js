const { SearchCommand, Constants, SwitchbladeEmbed } = require('../../')
const Turndown = require('turndown')
const turndownService = new Turndown()
const moment = require('moment')

module.exports = class FlatHubCommand extends SearchCommand {
  constructor (client) {
    super({
      name: 'flathub',
      aliases: ['flath'],
      requirements: { apis: ['flathub'] },
      embedColor: Constants.FLATHUB_COLOR,
      embedLogoURL: 'https://i.imgur.com/9hFtZnF.png'
    }, client)
  }

  search (_, query) {
    return this.client.apis.flathub.search(query)
  }

  searchResultFormatter (item) {
    return `[${item.name}](https://flathub.org/apps/details/${item.flatpakAppId}) - ${item.summary}`
  }

  async handleResult ({ t, author, channel, language }, { flatpakAppId }) {
    channel.startTyping()
    const { name, summary, projectLicense, currentReleaseVersion, currentReleaseDate, description, downloadFlatpakRefUrl, categories, iconDesktopUrl, screenshots } = await this.client.apis.flathub.getApp(flatpakAppId)
    const screenshot = screenshots.length ? screenshots[Math.floor(Math.random() * screenshots.length)] : null
    const licence = /.+=(https?)/.test(projectLicense) ? `[${projectLicense.split('=')[0]}](${projectLicense.split('=')[1]})` : projectLicense
    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:flathub.title', { name }), this.embedLogoURL, `https://flathub.org/apps/details/${flatpakAppId}`)
      .setDescription(turndownService.turndown(description
        .replace(/\]/g, '\\\\］')
        .replace(/\[/g, '\\\\［')).substring(0, 500) + (description.length > 500 ? '...' : ''))
      .setThumbnail(iconDesktopUrl)
      .setImage(screenshot.imgDesktopUrl)
      .addField(t('commands:flathub.license'), licence, true)
      .addField(t('commands:flathub.version'), `${currentReleaseVersion} (${moment(currentReleaseDate).local(language).fromNow()})`, true)
      .addField(t('commands:flathub.categories'), categories.map(category => `\`${category.name}\``).join(', '))
      .addField(t('commands:flathub.download'), `[[${summary || name}]](${downloadFlatpakRefUrl})`)

    channel.send(embed).then(() => channel.stopTyping())
  }
}
