const { Command, SwitchbladeEmbed, Constants } = require('../../')

module.exports = class Pause extends Command {
  constructor (client) {
    super(client)
    this.name = 'help'
    this.aliases = ['commands']
  }

  async run (message, args, t) {
    const embed = new SwitchbladeEmbed(message.author)
    const guildDocument = message.guild && this.database && await this.database.guilds.get(message.guild.id)
    const prefix = (guildDocument && guildDocument.prefix) || process.env.PREFIX
    if (args.length > 0) {
      const command = this.client.commands.find(c => c.name === args[0])
      if (command) {
        embed
          .setTitle(command.name)
          .setDescription([
            t([`commands:${command.name}.commandDescription`, 'commands:help.noDescriptionProvided']),
            '',
            `**${t('commons:usage')}:** \`${prefix}${command.name} ${t([`commands:${command.name}.commandUsage`, ''])}\``,
            `**${t('commands:help.aliases')}:** ${command.aliases.map(a => `\`${a}\``).join(', ')}`
          ].join('\n'))
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
    message.channel.send(embed)
  }
}
