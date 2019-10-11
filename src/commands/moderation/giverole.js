const { Command, Constants, SwitchbladeEmbed } = require('../../')

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

  async run({ channel, author, role, t }, member) {
    const embed = new SwitchbladeEmbed(author)
    await member.addRole(role).then(modifiedMember => {
      if(!author.hasPermision('MANAGE_ROLES', false, true, false)) {
        if(author.highestRole.comparePositionTo(role) < 0) throw new CommandError(t('commands:giverole.roleAboveAuthors'))
        if(author.highestRole.comparePositionTo(member.highestRole) < 0) throw new CommandError(t('commands:giverole.roleBelow'))
      }
      embed
        .setTitle(t('commands:giverole.successTitle'))
        .setDescription(`${modifiedMember} - \`${role}\``)
    }).catch(err =>{
      embed
        .setColor(Constants.ERROR_COLOR)
        .setTitle(t('commands:giverole.cantGiverole'))
        .setDescription(`\`${err}\``)
    })
    channel.send(embed)
  }
}
