const { EventListener } = require('../')

module.exports = class AutoModerator extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['guildMemberAdd']
  }

  async onGuildMemberAdd (member) {
    const guild = member.guild
    const joinLockActive = await this.modules.joinLock.isActive(guild.id)

    // TODO: Write a function to parse {placeholders} like the one used below
    if (joinLockActive && member.kickable) {
      const language = await this.modules.language.retrieveValue(guild.id, 'language')
      const joinLockMessage = await this.modules.joinLock.retrieveValue(guild.id, 'message')
      const t = this.i18next.getFixedT(language)
      const message = joinLockMessage ? joinLockMessage.replace('{server}', guild.name) : t('moderation:joinLock.defaultPrivateMessage', { guild })
      return member.send(message).catch(() => {}).then(() => {
        member.kick(t('moderation:joinLock.kickReason'))
      })
    }

    const autoRoleActive = await this.modules.autoRole.isActive(guild.id)
    if (autoRoleActive) {
      const { userRoles, botRoles } = await this.modules.autoRole.retrieveValues(guild.id, ['userRoles', 'botRoles'])
      const rolesToAdd = member.user.bot && botRoles.length
        ? botRoles
        : !member.user.bot && userRoles.length
          ? userRoles
          : null
      if (rolesToAdd) member.addRoles(rolesToAdd, 'AutoRole')
    }
  }
}
