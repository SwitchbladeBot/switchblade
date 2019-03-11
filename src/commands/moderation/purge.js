const { Command, SwitchbladeEmbed, CommandError } = require('../../')

module.exports = class Purge extends Command {
  constructor (client) {
    super(client, {
      name: 'purge',
      aliases: ['prune'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_MESSAGES'], permissions: ['MANAGE_MESSAGES'] },
      parameters: [{
        type: 'number', required: false, full: false
      }]
    })
  }

  async run ({ channel, guild, author, t }, number = 50) {
    channel.startTyping()
    const embed = new SwitchbladeEmbed(author)
    channel.bulkDelete(number).then(() => {
      embed.setDescription(t('commands:purge.purged', { count: number || 50 }))
      channel.send(embed).then(() => channel.stopTyping())
    }).catch(() => {
      throw new CommandError('errors:generic')
    })
  }
}
