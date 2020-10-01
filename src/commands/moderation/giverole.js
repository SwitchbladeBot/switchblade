const { Command, Constants, SwitchbladeEmbed } = require('../../')

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

  async run ({ channel, guild, author, t }, member, role) {
    const embed = new SwitchbladeEmbed(author)
    console.log(role.position + '\n' + member.roles.highest.position)
    if (member.roles.highest.position < role.position) {
      await member.roles.add(role).then(() => {
        embed
          .setTitle(t('commands:giverole.roleAdded'))
      }).catch(() => {
        throw new CommandError(t('commands:giverole.error'))
      })
    } else {
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:giverole.higherError'))
    }
    channel.send(embed)
  }
}
