const { Command, CommandError, SwitchbladeEmbed, GitUtils } = require('../../')
const path = require('path')

const regexpSpecialChars = /([[\]^$|()\\+*?{}=!.])/gi
const quoteRegex = (text) => text.replace(regexpSpecialChars, '\\$1')
const prefixRegex = (prefix) => new RegExp(`^${quoteRegex(prefix)}`)

const REPOSITORY_URL = 'https://github.com/SwitchbladeBot/switchblade'

module.exports = class CommandSource extends Command {
  constructor (client) {
    super({
      name: 'commandsource',
      aliases: ['cmdsource', 'source'],
      category: 'bot',
      parameters: [{
        type: 'string', full: true, required: true, missingError: 'commands:commandsource.missingText'
      }]
    }, client)
  }

  async run ({ channel, author, t, prefix }, cmd) {
    const branchOrHash = await GitUtils.getHashOrBranch()
    if (!branchOrHash) throw new CommandError(t('commands:commandsource.branchNotUpToDate'))
    const validCommands = this.client.commands.filter(c => !c.hidden)

    cmd = cmd.replace(prefixRegex(prefix), '')
    const command = cmd.split(' ').reduce((o, ca) => {
      const arr = (Array.isArray(o) && o) || (o && o.subcommands)
      if (!arr) return o
      return arr.find(c => c.name === ca || (c.aliases && c.aliases.includes(ca)))
    }, validCommands)

    if (!command) throw new CommandError(t('commands:commandsource.commandNotFound'))

    const paths = ['src', 'commands', command.category, command.name]
    let cmdPath = path.join(process.cwd(), 'src', 'commands', command.category, command.name)
    try {
      require(cmdPath)
    } catch (_) {
      throw new CommandError(t('commands:commandsource.commandFileNotFound'))
    }

    const embed = new SwitchbladeEmbed(author)
      .setTitle(command.name)
      .setDescriptionFromBlockArray([
        [
          `${t('commands:commandsource.currentBranchOrCommit')} [${branchOrHash}](${REPOSITORY_URL}/tree/${branchOrHash})`,
          `[${t('commands:commandsource.commandSource')}](${REPOSITORY_URL}/blob/${branchOrHash}/${paths.join('/')}.js)`
        ]
      ])

    channel.send(embed)
  }
}
