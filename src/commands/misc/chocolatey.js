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
    // TODO: figure out why sometimes the api returns JSON and other times it returns XML (eg.: vim and git, respectively)
    return res.data.d.results
  }

  searchResultFormatter (i) {
    return `[${i.Title} - ${i.Authors}](${i.GalleryDetailsUrl})`
  }

  async handleResult ({ t, author, channel, language }, { GalleryDetailsUrl, IconUrl, Title, Summary }) {
    channel.send(
      new SwitchbladeEmbed(author)
        .setColor(this.embedColor)
        .setAuthor(t('commmands:chocolatey.chocolatey'), this.embedLogoURL, 'https://chocolatey.org/packages')
        .setURL(GalleryDetailsUrl)
        .setThumbnail(IconUrl)
        .setTitle(Title)
        .setDescription(Summary)
    )
  }
}
