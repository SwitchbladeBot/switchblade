const { Command, CommandError, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Giverole extends Command {
  constructor (client) {
    super(client, {
      name: 'giverole',
      category: 'moderation',
      requirements: { guildOnly: true, botPermissions: ['MANAGE_ROLES'], permissions: ['MANAGE_ROLES'] },
      parameters: [{
        type: 'member', acceptBot: true, missingError: 'commands:giverole.missingUser'
      }, {
        type: 'role', full: true, missingError: 'errors:invalidRole'
      }]
    })
  }

  async run ({ channel, member, author, t }, targetMember, role) {
    const embed = new SwitchbladeEmbed(author)
    try {
      if (!member.hasPermission('ADMINISTRATOR', false, true, false)) {
        if (member.highestRole.comparePositionTo(role) <= 0) throw new CommandError(t('commands:giverole.roleAboveAuthors'))
        if (member.highestRole.comparePositionTo(targetMember.highestRole) <= 0) throw new CommandError(t('commands:giverole.roleBelow'))
      }
      await targetMember.addRole(role)
      embed
        .setTitle(t('commands:giverole.successTitle'))
        .setDescription(`${targetMember} - \`${role.name}\``)
    } catch (err) {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:giverole.cantGiverole'))
        .setDescription(`\`${err}\``)
    }
    channel.send(embed)
  }
}
