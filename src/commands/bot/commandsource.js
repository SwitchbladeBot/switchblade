const { Command, CommandError, SwitchbladeEmbed, GitUtils } = require('../../')
const { sep } = require('path')
const moment = require('moment')

const REPOSITORY_URL = 'https://github.com/SwitchbladeBot/switchblade'

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
    const branchOrHash = await GitUtils.getHashOrBranch()
    if (branchOrHash === null) {
      await channel.stopTyping(true)
      throw new CommandError(t('commands:commandsource.noRepositoryOrHEAD'))
    }

    moment.locale(language)

    const path = command.path.split(sep).join('/')
    const { date, user } = await GitUtils.getLatestCommitInfo()

    channel.send(new SwitchbladeEmbed(author)
      .setTitle(command.fullName)
      .setDescriptionFromBlockArray([
        [
          !branchOrHash ? `**${t('commands:commandsource.branchNotUpToDate')}**` : '',
          `[${path}](${REPOSITORY_URL}/blob/${branchOrHash || 'master'}/${path})`
        ],
        [
          `${t('commands:commandsource.lastEdited', { ago: moment(date).fromNow(), user })}`,
          `[\`${branchOrHash || 'master'}\`](${REPOSITORY_URL}/tree/${branchOrHash || 'master'})`
        ]
      ])
    ).then(() => channel.stopTyping(true))
  }
}
