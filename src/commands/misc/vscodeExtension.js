const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../')
const moment = require('moment')

const EXTENSION_URL = 'https://marketplace.visualstudio.com/items?itemName='
// const IMAGE = (publisherName, extensionName) => {
//   return `https://${publisherName}.gallerycdn.vsassets.io/extensions/${publisherName}/${extensionName}/2.1.8/1594861497267/Microsoft.VisualStudio.Services.Icons.Default
// }

module.exports = class VSCodeExtensions extends SearchCommand {
  constructor (client) {
    super({
      name: 'vscodeextension',
      aliases: ['vscodeextensions', 'codeextensions', 'codeext', 'vscmarketplace'],
      requirements: { apis: ['vscodeextensions'] },
      embedColor: Constants.VSCODE_EXTENSIONS_COLOR,
      embedLogoURL: 'https://i.imgur.com/qB28xlw.png'
    }, client)
  }

  async search (_, query) {
    const res = await this.client.apis.vscodeextensions.search(query)
    return res.data.results[0].extensions
  }

  searchResultFormatter (i) {
    return `[${i.displayName} - ${i.publisher.displayName}](${EXTENSION_URL}${i.publisher.publisherName}.${i.extensionName})`
  }

  async handleResult ({ t, author, channel, language }, { displayName, shortDescription, publisher, releaseDate, extensionId }) {
    moment.locale(language)
    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setFooter(t('commands:vscodeextension.id', { extensionId }))
        .addField(t('commands:vscodeextension.name'), displayName, true)
        .addField(t('commands:vscodeextension.publisher'), publisher.displayName, true)
        .addField(t('commands:vscodeextension.releaseDate'), `${moment(releaseDate).format('LLL')}\n(${moment(releaseDate).fromNow()})`)
        .addField(t('commands:vscodeextension.description'), shortDescription)
    )
  }
}
