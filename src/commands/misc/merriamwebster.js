const { SearchCommand, SwitchbladeEmbed, Constants } = require('../..')
const moment = require('moment')

module.exports = class MerriamWebster extends SearchCommand {
  constructor (client) {
    super({
      name: 'merriamwebster',
      aliases: ['merriam-webster', 'merriamwebsterdict'],
      requirements: { apis: ['merriamwebster'] },
      embedColor: Constants.MERRIAM_WEBSTER_COLOR,
      embedLogoURL: 'https://i.imgur.com/HfQ0piU.png'
    }, client)
  }

  async search ({ channel }, query) {
    const res = await this.client.apis.merriamwebster.search(query)
    return res.data.filter((d) => {
      if (!d.shortdef.length) return false
      return !(d.meta.offensive && !channel.nsfw)
    })
  }

  searchResultFormatter (i) {
    return `${i.meta.stems[0]} - *${i.fl}*`
  }

  async handleResult ({ t, author, channel, language }, { hwi, meta, shortdef, fl }) {
    moment.locale(language)

    channel.send(
      new SwitchbladeEmbed(author)
        .setAuthor(t('commands:merriamwebster.title'), this.embedLogoURL, 'https://www.merriam-webster.com')
        .setColor(this.embedColor)
        .setTitle(meta.stems[0])
        .setDescriptionFromBlockArray([
          [
            hwi.prs ? `> /${hwi.prs[0].mw}/` : '',
            `*${fl}*`
          ],
          shortdef.map((d, i) => `\`${String(i + 1).padStart(2, '0')}\`. ${d}`)
        ])
    )
  }
}
