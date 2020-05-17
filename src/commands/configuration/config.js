const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class Config extends Command {
  constructor (client) {
    super({
      name: 'config',
      aliases: ['cfg'],
      category: 'configuration',
      requirements: { guildOnly: true, databaseOnly: true, permissions: ['MANAGE_GUILD'] }
    }, client)
  }

  run ({ t, author, prefix, alias, channel }) {
    const embed = new SwitchbladeEmbed(author)
    embed.setDescription([
      t('commands:config.guildPrefix', { command: `${prefix}${alias || this.name}` }),
      t('commands:config.guildLang', { command: `${prefix}${alias || this.name}` })
    ].join('\n'))
    channel.send(embed)
  }
}
