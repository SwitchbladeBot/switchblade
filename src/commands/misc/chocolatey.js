const { SearchCommand, SwitchbladeEmbed, Constants } = require('../..')

module.exports = class Chocolatey extends SearchCommand {
  constructor (client) {
    super({
      name: 'chocolatey',
      aliases: ['choco'],
      requirements: { apis: ['chocolatey'] },
      embedColor: Constants.CHOCOLATEY_COLOR,
      embedLogoURL: 'https://i.imgur.com/CRddVay.png'
    }, client)
  }

  async search (_, query) {
    const res = await this.client.apis.chocolatey.search(query)
    if ('d' in res.data) return res.data.d.results
  }

  searchResultFormatter (i) {
    return `[${i.Title} - ${i.Authors}](${i.GalleryDetailsUrl})`
  }

  async handleResult ({ t, author, channel, language }, { __metadata, Authors, Description, DownloadCount, GalleryDetailsUrl, LicenseUrl, IconUrl, Tags, Title, Summary, Version }) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setAuthor('Chocolatey', this.embedLogoURL, 'https://chocolatey.org/packages')
        .setURL(GalleryDetailsUrl)
        .setThumbnail(IconUrl)
        .setTitle(`${Title} v${Version}`)
        .setDescriptionFromBlockArray([
          [
            Summary || (Description && Description.split('\n')[0].replace(/#/g, ''))
          ],
          [
            t('commands:chocolatey.by', { authors: Authors.split(', ').map((a) => `**${a}**`).join(', ') })
          ],
          [
            t('commands:chocolatey.installs', { count: DownloadCount.toLocaleString(language) })
          ],
          [
            Tags.trim().split(' ').map((t) => `\`${t}\``).join(', ')
          ],
          [
            `[${t('commands:chocolatey.license')}](${LicenseUrl})`
          ],
          [
            `\`\`\`\nchoco install ${__metadata.uri.match(/Id='([.\w\d_-]+)'/)[1].toLowerCase()}\n\`\`\``
          ]
        ])
    )
  }
}
