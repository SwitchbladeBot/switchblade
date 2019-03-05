const { SearchCommand, SwitchbladeEmbed, Constants } = require('../../')
const npm = require('search-npm-registry')

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

  async handleResult ({ t, channel, author }, pkg) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setColor(Constants.NPM_COLOR)
      .setAuthor(pkg.name, this.embedLogoURL, pkg.links.npm)
      .setDescription(`${pkg.description || t('commands:npm.noDescription')}\n${pkg.links.npm}\n\n\`npm install --save ${pkg.name}\``)
    channel.send(embed).then(() => channel.stopTyping())
  }
}
