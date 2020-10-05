const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../')
const moment = require('moment')

module.exports = class Packagist extends SearchCommand {
  constructor (client) {
    super({
      name: 'packagist',
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        fullJoin: '-',
        missingError: 'commands:packagist.noNameProvided'
      }],
      requirements: { apis: ['packagist'] },
      embedColor: Constants.PACKAGIST_COLOR,
      embedLogoURL: 'https://i.imgur.com/MLTCgKN.png'
    }, client)
  }

  async search (_, query) {
    const { data } = await this.client.apis.packagist.search(query)
    return Object.values(data.results)
  }

  searchResultFormatter (item) {
    return `[${item.name}](${item.repository})`
  }

  async handleResult ({ channel, author, language }, item) {
    const embed = new SwitchbladeEmbed(author)
    moment.locale(language)
    channel.startTyping()
    embed
      .setColor(Constants.PACKAGIST_COLOR)
      .setAuthor('Packagist', this.embedLogoURL, 'https://packagist.org/')
      .setDescriptionFromBlockArray([
        [
          `[${item.name}](${item.url})`,
          item.description ? item.description : null
        ],
        [
          `\`\`\`composer require ${item.name}\`\`\``
        ]
      ])
    channel.send(embed).then(() => channel.stopTyping())
  }
}
