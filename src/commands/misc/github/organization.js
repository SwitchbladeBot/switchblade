const { CommandStructures, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const { Command, CommandParameters, StringParameter, CommandError } = CommandStructures
const moment = require('moment')

module.exports = class GitHubOrganization extends Command {
  constructor (client, parentCommand) {
    super(client, parentCommand || 'github')
    this.name = 'organization'
    this.aliases = ['org']

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: false, required: true, missingError: 'commands:github.subcommands.organization.noOrg' })
    )
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
        .setDescription(data.description || 'This organization doesn\'t have a description')
        .addField('Members', MiscUtils.formatNumber(orgMembers, language), true)
        .addField('Organization created at', `${moment(data.created_at).format('LLL')}\n(${moment(data.created_at).fromNow()})`, true)
      if (data.public_repos > 0) {
        const repos = await this.client.apis.github.getOrganizationRepositories(organization)
        embed.addField(`Repositories (${data.public_repos})`, `${repos.slice(0, 5).map(r => `${r.fork ? `${Constants.FORKED} ` : ''}\`${r.full_name}\``).join('\n')}${data.public_repos > 5 ? `\n${t('commands:github.subcommands.organization.moreRepos', { url: `${data.html_url}/repositories`, repos: data.public_repos - 5 })}` : ''}`, true)
      }

      await channel.send(embed).then(() => channel.stopTyping())
      return true
    } catch (e) {
      return false
    }
  }
}
