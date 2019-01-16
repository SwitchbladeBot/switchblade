const { EventListener } = require('../')

module.exports = class AutoModerator extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['guildMemberAdd']
  }

  async onGuildMemberAdd (member) {
    const guild = member.guild
    const guildDocument = this.database && await this.database.guilds.findOne(guild.id, 'joinLock joinLockMessage language')

    // TODO: Write a function to parse {placeholders} like the one used below
    if (guildDocument && guildDocument.joinLock && member.kickable) {
      const t = this.i18next.getFixedT(guildDocument.language)
      const message = guildDocument.joinLockMessage ? guildDocument.joinLockMessage.replace('{server}', guild.name) : t('moderation:joinLock.defaultPrivateMessage', { guild })
      member.send(message).catch(() => {})
      member.kick(t('moderation:joinLock.kickReason'))
    }
  }
}
