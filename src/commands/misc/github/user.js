const { Command, CommandError, SwitchbladeEmbed, Constants, MiscUtils } = require('../../../')
const moment = require('moment')

module.exports = class GitHubUser extends Command {
  constructor (client) {
    super(client, {
      name: 'user',
      aliases: ['u'],
      parentCommand: 'github',
      parameters: [{
        type: 'string', missingError: 'commands:github.subcommands.user.noUser'
      }]
    })
  }

  async run ({ t, author, channel, language }, user) {
    if (!await this.getUser(t, author, channel, language, user)) throw new CommandError(t('commands:github.subcommands.user.userNotFound'))
  }

  async getUser (t, author, channel, language, user) {
    try {
      channel.startTyping()
      moment.locale(language)
      const data = await this.client.apis.github.getUser(user)
      const embed = new SwitchbladeEmbed(author)
        .setColor(Constants.GITHUB_COLOR)
        .setAuthor('GitHub', this.parentCommand.GITHUB_LOGO)
        .setTitle(`${data.login}${data.name ? ` - ${data.name}` : ''}`)
        .setURL(data.html_url)
        .setThumbnail(data.avatar_url)
        .setDescription(data.bio || t('commands:github.subcommands.user.noBio'))
        .addField(t('commands:github.subcommands.user.followers'), MiscUtils.formatNumber(data.followers, language), true)
        .addField(t('commands:github.subcommands.user.following'), MiscUtils.formatNumber(data.following, language), true)
        .addField(t('commands:github.subcommands.user.createdAt'), `${moment(data.created_at).format('LLL')}\n(${moment(data.created_at).fromNow()})`, true)
      if (data.public_repos > 0) {
        const repos = await this.client.apis.github.getUserRepositories(user)
        embed.addField(t('commands:github.subcommands.user.repositories', { count: data.public_repos }), `${repos.slice(0, 5).map(r => `${r.fork ? `${Constants.FORKED} ` : ''}\`${r.full_name}\``).join('\n')}${data.public_repos > 5 ? `\n${t('commands:github.subcommands.user.moreRepos', { repos: data.public_repos - 5 })}` : ''}`, true)
      }

      await channel.send(embed).then(() => channel.stopTyping())
      return true
    } catch (e) {
      return false
    }
  }
}
