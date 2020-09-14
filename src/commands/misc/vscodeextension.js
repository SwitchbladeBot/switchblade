const { SearchCommand, SwitchbladeEmbed, Constants } = require('../..')
const moment = require('moment')

const EXTENSION_URL = 'https://marketplace.visualstudio.com/items/'

module.exports = class VSCodeExtensions extends SearchCommand {
  constructor (client) {
    super({
      name: 'vscodeextension',
      aliases: ['vscodeextensions', 'codeextensions', 'codeext', 'vscmarketplace', 'vscode'],
      requirements: { apis: ['vscodeextensions'] },
      embedColor: Constants.VSCODE_EXTENSIONS_COLOR,
      embedLogoURL: 'https://i.imgur.com/Ihot5Zi.png'
    }, client)
  }

  async search (_, query) {
    const res = await this.client.apis.vscodeextensions.search(query)
    return res.data.results[0].extensions
  }

  searchResultFormatter (i) {
    return `[${i.displayName} - ${i.publisher.displayName}](${EXTENSION_URL}${i.publisher.publisherName}.${i.extensionName})`
  }

  getRatingEmojis (rating) {
    return (this.getEmoji('ratingstar', '⭐').repeat(Math.floor(rating))) + (this.getEmoji('ratinghalfstar').repeat(Math.ceil(rating - Math.floor(rating))))
  }

  async handleResult ({ t, author, channel, language }, { displayName, shortDescription, publisher, versions, extensionName, statistics, categories, tags }) {
    moment.locale(language)
    const { assetUri, lastUpdated, version } = versions[0]

    const [{ value: installs }, { value: averageRating }, { value: ratingCount }] = statistics
    const stars = this.getRatingEmojis(averageRating)

    const url = `${EXTENSION_URL}${publisher.publisherName}.${extensionName}`

    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setAuthor(t('commands:vscodeextension.marketplace'), this.embedLogoURL, 'https://marketplace.visualstudio.com/vscode')
        .setURL(url)
        .setThumbnail(`${assetUri}/Microsoft.VisualStudio.Services.Icons.Default`)
        .setTitle(displayName)
        .setDescriptionFromBlockArray([
          [
            shortDescription
          ],
          [
            t('commands:vscodeextension.by', { displayName: publisher.displayName, name: publisher.publisherName })
          ],
          [
            t('commands:vscodeextension.installs', { count: installs.toLocaleString(language) }),
            `${stars} (${Math.round(ratingCount)})`
          ],
          [
            categories.join(', '),
            tags.map((t) => `\`${t}\``).join(', ')
          ],
          [
            t('commands:vscodeextension.lastUpdate', { ago: moment(lastUpdated).fromNow(), version })
          ],
          [
            `[${t('commands:vscodeextension.license')}](${url}/license)`,
            `[${t('commands:vscodeextension.changelog')}](${url}/changelog)`,
            `[${t('commands:vscodeextension.install')}](https://vscoderedirect.switchblade.xyz/${publisher.publisherName}.${extensionName})`
          ]
        ])
    )
  }
}
