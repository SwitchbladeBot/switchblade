const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Help extends Command {
  constructor (client) {
    super({
      name: 'help',
      aliases: ['commands', 'ajuda', 'halp'],
      category: 'bot',
      parameters: [{
        type: 'command', full: true, required: false
      }]
    }, client)
  }

  async run ({ t, author, channel, guild, prefix }, command) {
    const embed = new SwitchbladeEmbed(author)

    if (command) {
      const description = [
        t([`commands:${command.tPath}.commandDescription`, 'commands:help.noDescriptionProvided']),
        '',
        command.usage(t, prefix, false)
      ]

      if (command.aliases && command.aliases.length > 0) description.push(`**${t('commands:help.aliases')}:** ${command.aliases.map(a => `\`${a}\``).join(', ')}`)
      if (command.subcommands.length > 0) description.push(`**${t('commands:help.subcommands')}:** ${command.subcommands.map(a => `\`${a.name}\``).join(', ')}`)
      if (command.requirements && command.requirements.permissions && command.requirements.permissions.length > 0) description.push(`**${t('commands:help.permissions')}:** ${command.requirements.permissions.map(p => `\`${t(`permissions:${p}`)}\``).join(', ')}`)
      if (command.requirements && command.requirements.botPermissions && command.requirements.botPermissions.length > 0) description.push(`**${t('commands:help.botPermissions')}:** ${command.requirements.botPermissions.map(p => `\`${t(`permissions:${p}`)}\``).join(', ')}`)

      embed.setTitle(command.fullName)
        .setDescription(description.join('\n'))
    } else {
      const botMention = `<@!${this.client.user.id}>`
      embed
        .setAuthor(t('commands:help.listTitle'), this.client.user.displayAvatarURL({ format: 'png' }))
        .setDescription([
          `**${t('commands:help.prefix')}:** \`${prefix}\` (${t('commands:help.youCanUse', { botMention })})`,
          `**${t('commands:help.specificInformation', { helpString: `\`${prefix}${this.name} ${t('commands:help.commandUsage')}\`` })}**`
        ].join('\n'))

      const validCommands = this.client.commands.filter(c => !c.hidden)
      const categories = validCommands.map(c => c.category).filter((v, i, a) => a.indexOf(v) === i)
      categories
        .sort((a, b) => t(`categories:${a}`).localeCompare(t(`categories:${b}`)))
        .forEach(category => {
          const commands = validCommands
            .filter(c => c.category === category)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => `\`${c.name}\``).join('**, **')

          const length = validCommands
            .filter(c => c.category === category).length

          embed.addField(`${t(`categories:${category}`)} [**${length}**]`, commands, false)
        })
    }
    channel.send(embed)
  }
}
