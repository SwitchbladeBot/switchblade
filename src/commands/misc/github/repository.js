const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const { Command, CommandParameters, StringParameter, CommandError } = CommandStructures
const moment = require('moment')

module.exports = class GitHubRepository extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'github')
    this.name = 'repository'
    this.aliases = ['repo']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: false, required: true, missingError: 'commands:github.subcommands.repository.noRepo' })
    )
  }

  async run ({ t, author, channel, message, language }, query) {
    channel.startTyping()

    const results = await this.parentCommand.searchHandler(query)
    if (results.ids.length === 0) throw new CommandError(t('commands:github.subcommands.repository.repoNotFound'))

    const { description, ids } = results

    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.GITHUB_COLOR)
      .setDescription(description)
      .setAuthor(t('commands:github.subcommands.repository.results', { query }), this.parentCommand.GITHUB_LOGO)
      .setTitle(t('commands:github.subcommands.repository.selectResult'))

    await channel.send(embed)
    await channel.stopTyping()

    this.parentCommand.awaitResponseMessage(message, ids, repo => this.getRepository(t, author, channel, language, repo))
  }

  async getRepository (t, author, channel, language, repo) {
    channel.startTyping()
    moment.locale(language)
    const repositorySplitted = repo.split('/')
    const data = await this.client.apis.github.getRepository(repositorySplitted[0], repositorySplitted[1])
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.GITHUB_COLOR)
      .setAuthor('GitHub', this.parentCommand.GITHUB_LOGO)
      .setTitle(data.full_name)
      .setURL(data.html_url)
      .setThumbnail(data.owner.avatar_url)
      .setDescription(data.description || 'This repository has no description')
      .addField('Watchers', MiscUtils.formatNumber(data.watchers, language), true)
      .addField('Stars', MiscUtils.formatNumber(data.stargazers_count, language), true)
      .addField('Forks', MiscUtils.formatNumber(data.forks, language), true)
    if (data.license && data.license.key !== 'other') {
      embed.addField('License', `[${data.license.spdx_id}](${data.license.url})`, true)
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
