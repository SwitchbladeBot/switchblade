const { Command, CommandError, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class GitHubOrganization extends Command {
  constructor (client) {
    super({
      name: 'organization',
      aliases: ['org'],
      parent: 'github',
      parameters: [{
        type: 'string', missingError: 'commands:github.subcommands.organization.noOrg'
      }]
    }, client)
  }

  async run ({ t, author, channel, language }, organization) {
    channel.startTyping()
    moment.locale(language)

    const data = await this.client.apis.github.getOrganization(organization)
    if (!data.login) throw new CommandError(t('commands:github.subcommands.organization.orgNotFound'))

    const orgMembers = await this.client.apis.github.getOrganizationMembers(organization)
    const embed = new SwitchbladeEmbed(author)
      .setColor(Constants.GITHUB_COLOR)
      .setAuthor('GitHub', this.parentCommand.authorImage)
      .setTitle(`${data.login}${data.name ? ` - ${data.name}` : ''}`)
      .setURL(data.html_url)
      .setThumbnail(data.avatar_url)
      .setDescription(data.description || t('commands:github.subcommands.organization.noDescription'))
      .addField(t('commands:github.subcommands.organization.members'), MiscUtils.formatNumber(orgMembers, language))
      .addField(t('commands:github.subcommands.organization.createdAt'), `${moment(data.created_at).format('LLL')}\n(${moment(data.created_at).fromNow()})`)

    if (data.public_repos > 0) {
      const repos = await this.client.apis.github.getOrganizationRepositories(organization)
      embed.addField(t('commands:github.subcommands.user.repositories', { count: data.public_repos }), `${repos.slice(0, 5).map(r => `\`${r.full_name}\` ${r.fork ? ` ${this.getEmoji('forked')}` : ''}`).join('\n')}${data.public_repos > 5 ? `\n${t('commands:github.subcommands.organization.moreRepos', { repos: data.public_repos - 5 })}` : ''}`)
    }

    channel.send(embed).then(() => channel.stopTyping())
  }
}
