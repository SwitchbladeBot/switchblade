const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class Config extends Command {
  constructor (client) {
    super(client)
    this.name = 'config'
    this.aliases = ['cfg']
    this.category = 'configuration'

    this.requirements = new CommandRequirements(this, { guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD'] })
  }

  run ({ t, author, prefix, alias, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription([
      t('commands:config.guildPrefix', { command: `${prefix}${alias || this.name}` }),
      t('commands:config.guildLang', { command: `${prefix}${alias || this.name}` }),
      t('commands:config.deleteUserMessages', { command: `${prefix}${alias || this.name}` })
    ].join('\n'))
    channel.send(embed)
  }
}
