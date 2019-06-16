const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../')
const npm = require('search-npm-registry')
const moment = require('moment')

module.exports = class Npm extends SearchCommand {
  constructor (client) {
    super(client, {
      name: 'npm',
      category: 'utility',
      parameters: [{
        type: 'string',
        full: true,
        fullJoin: '-',
        missingError: 'commands:npm.noNameProvided'
      }],
      embedColor: Constants.NPM_COLOR,
      embedLogoURL: 'https://i.imgur.com/24yrZxG.png'
    })
  }

  async search (context, query) {
    return npm().text(query).size(10).search()
  }

  searchResultFormatter (obj) {
    return `[${obj.name}](${obj.links.npm})`
  }

  async handleResult ({ t, channel, author, language }, pkg) {
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
