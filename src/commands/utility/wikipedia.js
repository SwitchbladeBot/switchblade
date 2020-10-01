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

  async search (_, query) {
    const res = await wiki().search(query)
    return res.results
  }

  searchResultFormatter (i) {
    return `[${i}](https://en.wikipedia.org/wiki/${encodeURIComponent(i)})`
  }

  async handleResult ({ t, author, channel, language }, name) {
    const info = await wiki().page(name)
    const [thumbnail, description] = await Promise.all([
      info.mainImage(),
      info.summary()
    ])

    channel.send(
      new SwitchbladeEmbed(author)
        .setDescription(description.split('\n').slice(2).toString().substring(0, 1020) + '...')
        .setAuthor('Wikipedia', this.embedLogoURL, 'https://en.wikipedia.org')
        .setColor(this.embedColor)
        .setTitle(info.raw.title)
        .setURL(info.raw.fullurl)
        .setThumbnail(thumbnail)
    )
  }
}
