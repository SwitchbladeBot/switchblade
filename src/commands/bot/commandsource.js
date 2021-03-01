const { Command, SwitchbladeEmbed, GitUtils } = require('../../')
const { sep } = require('path')
const moment = require('moment')

const REPOSITORY_URL = (user, repository) => `https://github.com/${user}/${repository}`

module.exports = class CommandSource extends Command {
  constructor (client) {
    super({
      name: 'commandsource',
      aliases: ['cmdsource', 'source'],
      category: 'bot',
      parameters: [{
        type: 'command',
        full: true,
        required: true,
        missingError: 'commands:commandsource.missingCommand',
        acceptHidden: true
      }]
    }, client)
  }

  async run ({ channel, author, language, t }, command) {
    channel.startTyping()

    const org = process.env.GITHUB_USER || 'SwitchbladeBot'
    const repository = process.env.GITHUB_REPOSITORY || 'switchblade'
    const fallbackBranch = process.env.GITHUB_BRANCH || 'master'

    const branchOrHash = await GitUtils.getHashOrBranch(org, repository, fallbackBranch)

    moment.locale(language)

    const path = command.path.split(sep).join('/')
    const { date, user } = await GitUtils.getLatestCommitInfo(org, repository, fallbackBranch)

    channel.send(new SwitchbladeEmbed(author)
      .setTitle(command.fullName)
      .setDescriptionFromBlockArray([
        [
          !branchOrHash ? `**${t('commands:commandsource.branchNotUpToDate')}**` : '',
          `[${path}](${REPOSITORY_URL(org, repository)}/blob/${branchOrHash || 'master'}/${path})`
        ],
        [
          `${t('commands:commandsource.lastEdited', { ago: moment(date).fromNow(), user })}`,
          `[\`${branchOrHash || 'master'}\`](${REPOSITORY_URL(org, repository)}/tree/${branchOrHash || 'master'})`
        ]
      ])
    ).then(() => channel.stopTyping(true))
  }
}
