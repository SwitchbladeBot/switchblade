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
    embed.setColor(Constants.NPM_COLOR)
      .setAuthor(`${pkg.name} - v${pkg.version}`, this.embedLogoURL, pkg.links.npm)
      .setDescription(`${pkg.description || t('commands:npm.noDescription')}\n${pkg.links.npm}`)
      .addField(t('commands:npm.lastPublish'), moment(pkg.date).format('LLL'), true)
      .addField(t('commands:npm.install'), `\`npm install --save ${pkg.name}\``, true)
    if (pkg.keywords.length > 0) embed.addField(t('commands:npm:keywords'), pkg.keywords.map(k => `\`${k}\``).join(', '), true)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
