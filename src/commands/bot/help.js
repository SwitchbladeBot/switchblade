const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandError, CommandParameters, StringParameter } = CommandStructures

const regexpSpecialChars = /([[\]^$|()\\+*?{}=!.])/gi
const quoteRegex = (text) => text.replace(regexpSpecialChars, '\\$1')
const prefixRegex = (prefix) => new RegExp(`^${quoteRegex(prefix)}`)

module.exports = class Help extends Command {
  constructor (client) {
    super(client)
    this.name = 'help'
    this.aliases = ['commands', 'ajuda']
    this.category = 'bot'

    this.parameters = new CommandParameters(this,
      new StringParameter({ full: true, required: false })
    )
  }

  async run ({ t, author, channel, guild, defaultPrefix: prefix }, cmd) {
    const embed = new SwitchbladeEmbed(author)
    const validCommands = this.client.commands.filter(c => !c.hidden)

    if (cmd) {
      cmd = cmd.replace(prefixRegex(prefix), '')
      const command = cmd.split(' ').reduce((o, ca) => {
        const arr = (Array.isArray(o) && o) || (o && o.subcommands)
        if (!arr) return o
        return arr.find(c => c.name === ca || c.aliases.includes(ca))
      }, validCommands)

      if (command) {
        const description = [
          t([`commands:${command.tPath}.commandDescription`, 'commands:help.noDescriptionProvided']),
          '',
          command.usage(t, prefix, false)
        ]

        if (command.aliases.length > 0) description.push(`**${t('commands:help.aliases')}:** ${command.aliases.map(a => `\`${a}\``).join(', ')}`)
        if (command.subcommands.length > 0) description.push(`**${t('commands:help.subcommands')}:** ${command.subcommands.map(a => `\`${a.name}\``).join(', ')}`)

        embed.setTitle(command.fullName)
          .setDescription(description.join('\n'))
      } else {
        throw new CommandError(t('commands:help.commandNotFound'))
      }
    } else {
      embed
        .setAuthor(t('commands:help.listTitle'), this.client.user.displayAvatarURL)
        .setDescription([
          `**${t('commands:help.prefix')}:** \`${prefix}\` (${t('commands:help.youCanUse', { botMention: this.client.user })})`,
          `**${t('commands:help.specificInformation', { helpString: `\`${prefix}${this.name} ${t('commands:help.commandUsage')}\`` })}**`
        ].join('\n'))

      const categories = validCommands.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i)
      categories
        .sort((a, b) => t(`categories:${a}`).localeCompare(t(`categories:${b}`)))
        .forEach(category => {
          const commands = validCommands
            .filter(c => c.category === category)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => `\`${c.name}\``).join('**, **')
          embed.addField(t(`categories:${category}`), commands, false)
        })
    }
    channel.send(embed)
  }
}
