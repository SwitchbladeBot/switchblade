const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Pause extends Command {
  constructor (client) {
    super(client)
    this.name = 'help'
    this.aliases = ['commands']
  }

  async run ({ t, author, channel, guild }, args) {
    const embed = new SwitchbladeEmbed(author)
    const guildDocument = guild && this.database && await this.database.guilds.get(guild.id)
    const prefix = (guildDocument && guildDocument.prefix) || process.env.PREFIX
    if (args.length > 0) {
      const command = this.client.commands.find(c => c.name === args[0])
      if (command) {
        let description = [
          t([`commands:${command.name}.commandDescription`, 'commands:help.noDescriptionProvided']),
          '',
          `**${t('commons:usage')}:** \`${prefix}${command.name} ${t([`commands:${command.name}.commandUsage`, ''])}\``
        ].join('\n')
        if (command.aliases.length > 0) description += `\n**${t('commands:help.aliases')}:** ${command.aliases.map(a => `\`${a}\``).join(', ')}`
        embed
          .setTitle(command.name)
          .setDescription(description)
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
