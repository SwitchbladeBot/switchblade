const { CommandStructures, SwitchbladeEmbed } = require('../../')
const { Command, CommandRequirements } = CommandStructures

module.exports = class RestrictEmoji extends Command {
  constructor (client) {
    super(client)
    this.name = 'restrictemoji'
    this.category = 'utility'
    this.requirements = new CommandRequirements(this, { guildOnly: true, botPermissions: ['MANAGE_EMOJIS'], permissions: ['MANAGE_EMOJIS'] })
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
