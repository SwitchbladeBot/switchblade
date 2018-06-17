const { CommandStructures, SwitchbladeEmbed, Constants } = require('../../')
const { Command, CommandParameters, StringParameter } = CommandStructures

module.exports = class Pause extends Command {
  constructor (client) {
    super(client)
    this.name = 'help'
    this.aliases = ['commands']

    this.parameters = new CommandParameters(this,
      new StringParameter({full: true, required: false})
    )
  }

  async run ({ t, author, channel, guild, guildDocument }, cmd) {
    const embed = new SwitchbladeEmbed(author)
    const prefix = (guildDocument && guildDocument.prefix) || process.env.PREFIX
    if (cmd) {
      const command = this.client.commands.find(c => c.name === cmd)
      if (command) {
        const description = [
          t([`commands:${command.name}.commandDescription`, 'commands:help.noDescriptionProvided']),
          '',
          `**${t('commons:usage')}:** \`${prefix}${command.name} ${t([`commands:${command.name}.commandUsage`, ''])}\``
        ]
        if (command.aliases.length > 0) description.push(`**${t('commands:help.aliases')}:** ${command.aliases.map(a => `\`${a}\``).join(', ')}`)

        embed
          .setTitle(command.name)
          .setDescription(description.join('\n'))
      } else {
        embed
          .setColor(Constants.ERROR_COLOR)
          .setTitle(t('commands:help.commandNotFound'))
      }
    } else {
      const commands = this.client.commands.map(c => `\`${c.name}\``).sort((a, b) => a.localeCompare(b)).join('**, **')
      embed
        .setAuthor(t('commands:help.listTitle'), this.client.user.displayAvatarURL)
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
