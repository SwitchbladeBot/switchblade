const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../')
const moment = require('moment')

module.exports = class Npm extends SearchCommand {
  constructor (client) {
    super({
      name: 'npm',
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        fullJoin: '-',
        missingError: 'commands:npm.noNameProvided'
      }],
      requirements: { apis: ['npmregistry'] },
      embedColor: Constants.NPM_COLOR,
      embedLogoURL: 'https://i.imgur.com/24yrZxG.png'
    }, client)
  }

  async search (_, query) {
    const { data } = await this.client.apis.npmregistry.search(query)
    return data.objects
  }

  searchResultFormatter ({ package: pkg }) {
    return `[${pkg.name}](${pkg.links.npm})`
  }

  async handleResult ({ t, channel, author, language }, { package: pkg }) {
    const embed = new SwitchbladeEmbed(author)
    moment.locale(language)
    channel.startTyping()
    embed
      .setColor(Constants.NPM_COLOR)
      .setAuthor('npm', this.embedLogoURL, 'https://www.npmjs.com/')
      .setDescriptionFromBlockArray([
        [
          `[${pkg.name}](${pkg.links.npm})`,
          pkg.description ? pkg.description : null
        ],
        [
          pkg.keywords && pkg.keywords.length > 0 ? pkg.keywords.map(k => `\`${k}\``).join(', ') : null
        ],
        [
          t('commands:npm.published', { publisher: pkg.publisher.username, version: pkg.version, timeAgo: moment(pkg.date).fromNow() })
        ],
        [
          `\`\`\`npm i ${pkg.name}\`\`\``
        ]
      ])
    channel.send(embed).then(() => channel.stopTyping())
  }
}
