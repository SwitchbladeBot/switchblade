const { Command, CommandError, SwitchbladeEmbed, GitUtils } = require('../../')
const { sep } = require('path')

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

  async run ({ channel, author, t }, command) {
    const branchOrHash = await GitUtils.getHashOrBranch()
    if (branchOrHash === null) throw new CommandError(t('commands:commandsource.noRepositoryOrHEAD'))
    if (!branchOrHash) throw new CommandError(t('commands:commandsource.branchNotUpToDate'))

    channel.send(new SwitchbladeEmbed(author)
      .setTitle(command.name)
      .setDescription(`[${t('commands:commandsource.commandSource')}](${REPOSITORY_URL}/blob/${branchOrHash}/${command.path.split(sep).join('/')}) ([${branchOrHash}](${REPOSITORY_URL}/tree/${branchOrHash}))`)
    )
  }
}
