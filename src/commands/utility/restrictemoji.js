const { Command, SwitchbladeEmbed } = require('../../')

module.exports = class RestrictEmoji extends Command {
  constructor (client) {
    super({
      name: 'restrictemoji',
      category: 'utility',
      requirements: {
        guildOnly: true,
        botPermissions: ['MANAGE_EMOJIS'],
        permissions: ['MANAGE_EMOJIS']
      }
    }, client)
  }

  run ({ t, author, prefix, alias, channel }) {
    const embed = new SwitchbladeEmbed(author)
    channel.startTyping()
    embed.setDescription([
      t('commands:restrictemoji.addRole', { command: `${prefix}${alias || this.name}` }),
      t('commands:restrictemoji.removeRole', { command: `${prefix}${alias || this.name}` }),
      t('commands:restrictemoji.reset', { command: `${prefix}${alias || this.name}` })
    ].join('\n'))
    channel.send(embed).then(() => channel.stopTyping())
  }
}
