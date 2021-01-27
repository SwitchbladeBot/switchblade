const { SearchCommand, SwitchbladeEmbed, Constants } = require('../..')
const wiki = require('wikijs').default

module.exports = class Wikipedia extends SearchCommand {
  constructor (client) {
    super({
      name: 'wikipedia',
      aliases: ['wiki'],
      embedColor: Constants.WIKIPEDIA_COLOR,
      embedLogoURL: 'https://i.imgur.com/v4bsFUN.png'
    }, client)
  }

  async search ({ language }, query) {
    const lang = language.split('-')[0]
    const res = await wiki({ apiUrl: `https://${lang}.wikipedia.org/w/api.php` }).search(query)
    return res.results.map((i) => ({ name: i, url: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(i)}` }))
  }

  searchResultFormatter (i) {
    return `[${i.name}](${i.url})`
  }

  async handleResult ({ t, author, channel, language }, { name, url }) {
    const lang = language.split('-')[0]
    const info = await wiki({ apiUrl: `https://${lang}.wikipedia.org/w/api.php` }).page(name)
    const [thumbnail, description] = await Promise.all([
      info.mainImage(),
      info.summary()
    ])

    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(description.length > 2000 ? description.substring(0, 2000) + '...' : description)
        .setAuthor('Wikipedia', this.embedLogoURL, `https://${lang}.wikipedia.org`)
        .setColor(this.embedColor)
        .setTitle(info.raw.title)
        .setURL(info.raw.fullurl)
        .setThumbnail(thumbnail)
    )
  }
}
