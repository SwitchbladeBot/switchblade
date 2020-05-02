const { EventListener } = require('../')

module.exports = class AutoModerator extends EventListener {
  constructor (client) {
    super({
      events: ['guildMemberAdd']
    }, client)
  }

  async onGuildMemberAdd (member) {
    const guild = member.guild
    const joinLockActive = this.modules && await this.modules.joinLock.isActive(guild.id)

    // TODO: Write a function to parse {placeholders} like the one used below
    if (joinLockActive && member.kickable) {
      const language = await this.modules.language.retrieveValue(guild.id, 'language')
      const joinLockMessage = await this.modules.joinLock.retrieveValue(guild.id, 'message')
      const t = this.i18next.getFixedT(language)
      const message = joinLockMessage
        ? this.modules.joinLock.parseMessage(joinLockMessage, member)
        : t('moderation:joinLock.defaultPrivateMessage', { guild })
      return member.send(message).catch(() => {}).then(() => {
        member.kick(t('moderation:joinLock.kickReason'))
      })
    }

    const autoRoleActive = this.modules && await this.modules.autoRole.isActive(guild.id)
    if (autoRoleActive) {
      if (member.user.bot) {
        const botRoles = (await this.modules.autoRole.retrieveValue(guild.id, 'botRoles')).filter(r => !member.roles.has(r))
        if (botRoles.length) {
          member.addRoles(botRoles, 'AutoRole for bots')
        }
      } else {
        const userRoles = (await this.modules.autoRole.retrieveValue(guild.id, 'userRoles')).filter(r => !member.roles.has(r))
        if (userRoles.length) {
          member.addRoles(userRoles, 'AutoRole for users')
        }
      }
    }
  }
}
