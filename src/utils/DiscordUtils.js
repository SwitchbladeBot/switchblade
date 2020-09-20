module.exports = class DiscordUtils {
  // Replica of discord.js function until v12 update.
  static cleanContent (str, message) {
    return str
      .replace(/@(everyone|here)/g, '@\u200b$1')
      .replace(/<@!?[0-9]+>/g, input => {
        const id = input.replace(/<|!|>|@/g, '')
        if (message.channel.type === 'dm' || message.channel.type === 'group') {
          const user = message.client.users.cache.get(id)
          return user ? `@${user.username}` : input
        }

        const member = message.channel.guild.members.cache.get(id)
        if (member) {
          return `@${member.displayName}`
        } else {
          const user = message.client.users.cache.get(id)
          return user ? `@${user.username}` : input
        }
      })
      .replace(/<#[0-9]+>/g, input => {
        const channel = message.client.channels.cache.get(input.replace(/<|#|>/g, ''))
        return channel ? `#${channel.name}` : input
      })
      .replace(/<@&[0-9]+>/g, input => {
        if (message.channel.type === 'dm' || message.channel.type === 'group') return input
        const role = message.guild.roles.cache.get(input.replace(/<|@|>|&/g, ''))
        return role ? `@${role.name}` : input
      })
      .replace(/`/g, '')
  }

  /**
  * @param  {String} userID - The id of the user who should have permission checked.
  * @param  {Object} channel - The channel from the message.
  * @param  {Array<String>} permissions - An Array with discord permissions.
  * @param  {Function} t - The translate function.
  * @param  {String} blameWho - Who to blame if the permission is missing.
  * @returns {String}
  */
  static ensurePermissions (userID, channel, permissions, t, blameWho) {
    for (let i = 0; i < permissions.length; i++) {
      const permission = permissions[i]
      if (!channel.permissionsFor(userID).has(permission)) {
        return t(blameWho === 'bot' ? 'errors:iDontHavePermission' : 'errors:youDontHavePermissionToRead', { permission })
      }
    }

    return null
  }
}
