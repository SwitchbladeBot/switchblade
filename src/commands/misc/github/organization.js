const { Command, CommandError, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class GitHubOrganization extends Command {
  constructor (client) {
    super(client, {
      name: 'organization',
      aliases: ['org'],
      parentCommand: 'github',
      parameters: [{
        type: 'string', missingError: 'commands:github.subcommands.organization.noOrg'
      }]
    })
  }

  async run ({ t, author, channel, language }, organization) {
    if (!await this.getOrganization(t, author, channel, language, organization)) throw new CommandError(t('commands:github.subcommands.organization.orgNotFound'))
  }

  async getOrganization (t, author, channel, language, organization) {
    try {
      channel.startTyping()
      moment.locale(language)
      const data = await this.client.apis.github.getOrganization(organization)
      const orgMembers = await this.client.apis.github.getOrganizationMembers(organization)
      const embed = new SwitchbladeEmbed(author)
        .setColor(Constants.GITHUB_COLOR)
        .setAuthor('GitHub', this.parentCommand.GITHUB_LOGO)
        .setTitle(`${data.login}${data.name ? ` - ${data.name}` : ''}`)
        .setURL(data.html_url)
        .setThumbnail(data.avatar_url)
        .setDescription(data.description || t('commands:github.subcommands.organization.noDescription'))
        .addField(t('commands:github.subcommands.organization.members'), MiscUtils.formatNumber(orgMembers, language), true)
        .addField(t('commands:github.subcommands.organization.createdAt'), `${moment(data.created_at).format('LLL')}\n(${moment(data.created_at).fromNow()})`, true)
      if (data.public_repos > 0) {
        const repos = await this.client.apis.github.getOrganizationRepositories(organization)
        embed.addField(t('commands:github.subcommands.user.repositories', { count: data.public_repos }), `${repos.slice(0, 5).map(r => `${r.fork ? `${Constants.FORKED} ` : ''}\`${r.full_name}\``).join('\n')}${data.public_repos > 5 ? `\n${t('commands:github.subcommands.organization.moreRepos', { repos: data.public_repos - 5 })}` : ''}`, true)
      }

      await channel.send(embed).then(() => channel.stopTyping())
      return true
    } catch (e) {
      return false
    }
  }
}
