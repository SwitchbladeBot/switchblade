const { SearchCommand, SwitchbladeEmbed, Constants } = require('../..')
const moment = require('moment')

const BASE_URL = 'https://nodejs.org/en/docs'

module.exports = class Node extends SearchCommand {
  constructor (client) {
    super({
      name: 'node',
      aliases: ['nodedoc', 'nodedocumentation', 'nodejs'],
      requirements: { apis: ['node'] },
      embedColor: Constants.NODE_COLOR,
      embedLogoURL: 'https://i.imgur.com/VRL6erP.png'
    }, client)
  }

  search (_, query) {
    return this.client.apis.node.search(query)
  }

  searchResultFormatter (i) {
    return `[${i.name}](${BASE_URL}${i.url})`
  }

  async handleResult ({ t, author, channel, language }, info) {
    moment.locale(language)
    channel.startTyping()

    const { description, name, url, parameters, returns, syntax } = await this.client.apis.node.getInfo(info.url)

    const embed = new SwitchbladeEmbed(author)
      .setColor(this.embedColor)
      .setAuthor(t('commands:node.node'), this.embedLogoURL, BASE_URL)
      .setTitle(name)
      .setURL(url)
      .setDescription(description)
      .addField(t('commands:node.syntax'), `\`\`\`js\n${syntax}\n\`\`\`\n${parameters}`)

    if (returns) embed.addField(t('commands:node.returns'), returns)

    channel.send(embed).then(() => channel.stopTyping(true))
  }
}
