module.exports = class PermissionUtils {
  static isDeveloper (client, user) {
    const botGuild = client.guilds.get(process.env.BOT_GUILD)
    const developerRole = botGuild && botGuild.roles.get(process.env.DEVELOPER_ROLE)
    const hasRole = developerRole && developerRole.members.has(user.id)
    return hasRole
  }
}
