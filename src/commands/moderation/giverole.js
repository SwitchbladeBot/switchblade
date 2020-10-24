const { Command, SwitchbladeEmbed, CommandError } = require('../../')

module.exports = class GiveRole extends Command {
  constructor (client) {
    super({
      name: 'giverole',
      aliases: ['gr'],
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_ROLES'], permissions: ['MANAGE_ROLES'] },
      parameters: [{
        type: 'member', acceptBot: true, missingError: 'errors:invalidUser', acceptSelf: true
      },
      {
        type: 'role', full: true, missingError: 'errors:invalidRole'
      }]
    }, client)
  }

  async run ({ channel, guild, member: author, t }, member, role) {
    const embed = new SwitchbladeEmbed(author)
    if (member.roles.highest.position < role.position && author.roles.highest.position < role.position) {
      await member.roles.add(role).then(() => {
        embed
          .setTitle(t('commands:giverole.roleAdded'))
      }).catch(() => {
        throw new CommandError(t('commands:giverole.error'))
      })
    } else {
      throw new CommandError(t('commands:giverole.higherError'))
    }
  }
}
