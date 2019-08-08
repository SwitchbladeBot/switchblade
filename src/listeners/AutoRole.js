const { EventListener } = require('../')

module.exports = class AutoRole extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['guildMemberAdd']
  }

  async onGuildMemberAdd (member) {
    const guild = member.guild
    const { automaticRoles } = this.database && await this.database.guilds.findOne(guild.id, 'automaticRoles')

    if (automaticRoles) {
      if (member.user.bot) {
        automaticRoles.map(role => {
          if (role.onlyBots) member.addRole(role.id)
        })
      } else {
        automaticRoles.map(role => {
          if (!role.onlyBots) member.addRole(role.id)
        })
      }
    }
  }
}
