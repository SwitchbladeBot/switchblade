const { EventListener } = require('../')

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['guildMemberAdd']
  }

  async onGuildMemberAdd (member) {
    const guildDocument = this.database && await this.database.guilds.findOne(member.guild.id)
    const t = this.i18next.getFixedT(guildDocument.language)

    // Join Lock
    if (guildDocument && guildDocument.joinLock && member.guild.me.hasPermission('KICK_MEMBERS') && member.kickable) member.kick(t('moderation:reasons.joinLockEnabled'))
  }
}
