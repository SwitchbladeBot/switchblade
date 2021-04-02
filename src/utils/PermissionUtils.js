const fetch = require('node-fetch')

module.exports = class PermissionUtils {
  static async isDeveloper (client, user) {
    const { roles } = await fetch(`${client.options.http.api}/v${client.options.http.version}/guilds/${process.env.BOT_GUILD}/members/${user.id}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    }).then(res => res.json())
    const isDeveloper = (roles && roles.includes(process.env.DEVELOPER_ROLE)) || (process.env.DEVELOPER_USERS && process.env.DEVELOPER_USERS.split(',').includes(user.id))
    return isDeveloper
  }

  static specialRole (client, user) {
    const botGuild = client.guilds.cache.get(process.env.BOT_GUILD)
    const member = botGuild && botGuild.members.cache.get(user.id)
    if (member) {
      return member.roles.cache.filter(r => r.hoist).sort((a, b) => b.position - a.position).first()
    }
  }

  static async isManager (client, user) {
    const { roles } = await fetch(`${client.options.http.api}/v${client.options.http.version}/guilds/${process.env.BOT_GUILD}/members/${user.id}`, {
      headers: { Authorization: `Bot ${process.env.DISCORD_TOKEN}` }
    }).then(res => res.json())
    const isManager = (roles && roles.includes(process.env.MANAGER_ROLE)) || this.isDeveloper(client, user)
    return isManager
  }
}
