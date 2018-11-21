module.exports = class PermissionUtils {
  static isDeveloper (client, user) {
    const botGuild = client.guilds.get(process.env.BOT_GUILD)
    const developerRole = botGuild && botGuild.roles.get(process.env.DEVELOPER_ROLE)
    const hasRole = developerRole && developerRole.members.has(user.id)
    return hasRole
  }

  static specialRole (client, user) {
    const botGuild = client.guilds.get(process.env.BOT_GUILD)
    const member = botGuild && botGuild.members.get(user.id)
    if (member) {
      return member.roles.filter(r => r.hoist).sort((a, b) => b.position - a.position).first()
    }
  }

  static async isDj (client, user, channel) {
    const guild = channel.guild
    const role = await client.database.guilds.get(guild.id)
    if (!role) return
    const hasRole = role && role.members.has(user.id)
    return hasRole
  }
}
