const { Command, Constants, SwitchbladeEmbed } = require('../../')

module.exports = class Giverole extends Command {
  constructor(client) {
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

  async run({ channel, author, role }, member) {
    const embed = new SwitchbladeEmbed(author)
    await member.addRole(role)
  }
}
