module.exports = class DiscordUtils {
  // Replica of discord.js function until v12 update.
  static cleanContent (str, message) {
    return str
      .replace(/@(everyone|here)/g, '@\u200b$1')
      .replace(/<@!?[0-9]+>/g, input => {
        const id = input.replace(/<|!|>|@/g, '')
        if (message.channel.type === 'dm' || message.channel.type === 'group') {
          const user = message.client.users.get(id)
          return user ? `@${user.username}` : input
        }

        const member = message.channel.guild.members.get(id)
        if (member) {
          return `@${member.displayName}`
        } else {
          const user = message.client.users.get(id)
          return user ? `@${user.username}` : input
        }
      })
      .replace(/<#[0-9]+>/g, input => {
        const channel = message.client.channels.get(input.replace(/<|#|>/g, ''))
        return channel ? `#${channel.name}` : input
      })
      .replace(/<@&[0-9]+>/g, input => {
        if (message.channel.type === 'dm' || message.channel.type === 'group') return input
        const role = message.guild.roles.get(input.replace(/<|@|>|&/g, ''))
        return role ? `@${role.name}` : input
      })
  }
}
