const { EventListener } = require('../')

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['guildMemberAdd']
  }

  async onGuildMemberAdd (member) {
    const guildDocument = this.database && await this.database.guilds.findOne(member.guild.id)
    const t = this.i18next.getFixedT(guildDocument.language)
    const guild = member.guild

    // TODO: Write a function to parse {placeholders} like the one used below
    if (guildDocument && guildDocument.joinLock && guild.me.hasPermission('KICK_MEMBERS') && member.kickable) {
      member.send(guildDocument.joinLockMessage ? guildDocument.joinLockMessage.replace('{server}', guild.name) : t('moderation:joinLock.defaultPrivateMessage', { guild })).catch(() => {})
      member.kick(t('moderation:joinLock.kickReason'))
    }
  }
}
