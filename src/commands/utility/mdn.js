const { SearchCommand, SwitchbladeEmbed, Constants } = require('../..')
const moment = require('moment')

const BASE_URL = 'https://developer.mozilla.org'

module.exports = class MDN extends SearchCommand {
  constructor (client) {
    super({
      name: 'mdn',
      aliases: ['mdn', 'mdndoc', 'mdndocumentation', 'mozilladevelopernetwork'],
      requirements: { apis: ['mdn'] },
      embedColor: Constants.MDN_COLOR,
      embedLogoURL: 'https://i.imgur.com/6IzokAO.jpeg'
    }, client)
  }

  search (_, query) {
    return this.client.apis.mdn.search(query)
  }

  searchResultFormatter (i) {
    return `[${i.name}](${BASE_URL}${i.url})`
  }

  async handleResult ({ t, author, channel, language }, info) {
    moment.locale(language)
    channel.startTyping()

    const { description, name, url, parameters, returns, syntax } = await this.client.apis.mdn.getInfo(info.url)

    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:mdn.mdn'), this.embedLogoURL, BASE_URL)
      .setTitle(name)
      .setURL(url)
      .setDescription(description)
      .addField(t('commands:mdn.syntax'), `\`\`\`js\n${syntax}\n\`\`\`\n${parameters}`)

    if (returns) embed.addField(t('commands:mdn.returns'), returns)

    channel.send(embed).then(() => channel.stopTyping(true))
  }
}
