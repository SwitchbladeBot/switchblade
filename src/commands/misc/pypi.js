const { SearchCommand, SwitchbladeEmbed, Constants } = require('../..')
const moment = require('moment')

module.exports = class PyPi extends SearchCommand {
  constructor (client) {
    super ({
      name: 'pypi',
      aliases: ['pythonpackage'],
      requirements: { apis: ['pypiapi'] },
      embedColor: Constants.PYPI_COLOR,
      embedLogoURL: 'https://i.imgur.com/5scdGM8.png'
    }, client)
  }

  async search (_, query) {
    const res = await this.client.apis.pypiapi.search(query)
    return res
  }

  searchResultFormatter (i) {
    return `${i.id}: ${i.description}.`
  }

  async handleResult ({ t, author, channel, language, guild }, { id }) {
    const res = await this.client.apis.pypiapi.info(id)
    const {
      description,
      name,
      command,
      date,
      packageLink
    } = res

    moment.locale(language)

    channel.send(
      new SwitchbladeEmbed(author)
        .setAuthor('PyPi', this.embedLogoURL, 'https://pypi.org/')
        .setURL(packageLink)
        .setTitle(name)
        .setDescriptionFromBlockArray([
          [
            description.slice(0, 1024)
          ],
          [
            `${date}`
          ],
          [
            `Install with ${command}`
          ]
        ])
    )
  }
}
