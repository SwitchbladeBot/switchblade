const { SearchCommand, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class GitHubRepository extends SearchCommand {
  constructor (client) {
    super({
      name: 'repository',
      aliases: ['repo'],
      parent: 'github',
      embedColor: Constants.GITHUB_COLOR,
      embedLogoURL: 'https://i.imgur.com/gsY6oYB.png'
    }, client)
  }

  async search (context, query) {
    return this.client.apis.github.findRepositories(query, 10)
  }

  searchResultFormatter (obj) {
    return `[${obj.full_name}](${obj.html_url})`
  }

  async handleResult ({ t, channel, author, language }, { full_name: repo }) {
    channel.startTyping()
    moment.locale(language)
    const repositorySplitted = repo.split('/')
    const data = await this.client.apis.github.getRepository(repositorySplitted[0], repositorySplitted[1])
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.GITHUB_COLOR)
      .setAuthor('GitHub', this.parentCommand.authorImage)
      .setTitle(data.full_name)
      .setURL(data.html_url)
      .setThumbnail(data.owner.avatar_url)
      .setDescription(data.description || t('commands:github.subcommands.repository.noDescription'))
      .addField(t('commands:github.subcommands.repository.watchers'), MiscUtils.formatNumber(data.watchers, language), true)
      .addField(t('commands:github.subcommands.repository.stars'), MiscUtils.formatNumber(data.stargazers_count, language), true)
      .addField(t('commands:github.subcommands.repository.forks'), MiscUtils.formatNumber(data.forks, language), true)
    if (data.license && data.license.key !== 'other') {
      embed.addField(t('commands:github.subcommands.repository.license'), `[${data.license.spdx_id}](${data.license.url})`, true)
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
