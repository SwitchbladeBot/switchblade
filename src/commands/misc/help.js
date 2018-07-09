const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

const prefixRegex = (prefix) => new RegExp(`^(?:${prefix})?(.+)`)

module.exports = class Pause extends Command {
  constructor (client) {
    super(client)
    this.name = 'help'
    this.aliases = ['commands', 'ajuda']

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, required: false})
    )
  }

  async run ({ t, author, channel, guild, guildDocument }, cmd) {
    const embed = new SwitchbladeEmbed(author)
    const prefix = (guildDocument && guildDocument.prefix) || process.env.PREFIX
    const validCommands = this.client.commands.filter(c => !c.hidden)

    if (cmd) {
      const regexMatch = cmd.match(prefixRegex(prefix))
      cmd = regexMatch && regexMatch[1]
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
        embed.setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:help.commandNotFound'))
      }
    } else {
      const commands = validCommands.map(c => `\`${c.name}\``).sort((a, b) => a.localeCompare(b)).join('**, **')
      embed.setAuthor(t('commands:help.listTitle'), this.client.user.displayAvatarURL)
        .setDescription([
          commands,
          '',
          `**${t('commands:help.prefix')}:** \`${prefix}\` (${t('commands:help.youCanUse', {botMention: this.client.user})})`,
          '',
          `**${t('commands:help.specificInformation', {helpString: `\`${prefix}${this.name} ${t('commands:help.commandUsage')}\``})}**`
        ].join('\n'))
    }
    channel.send(embed)
  }
}
