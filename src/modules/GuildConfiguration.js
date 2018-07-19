const { Module } = require('../structures')

module.exports = class GuildConfiguration extends Module {
  constructor (client) {
    super(client)
    this.name = 'guildConfig'
    this.requiresDatabase = true
  }

  async setLanguage (guild, language) {
    const guildDoc = await this.client.database.guilds.get(guild.id)
    guildDoc.language = language
    guildDoc.save()
    this.logGuildChange(guild, 'language', language)
  }

  async setPrefix (guild, prefix) {
    const guildDoc = await this.client.database.guilds.get(guild.id)
    guildDoc.prefix = prefix
    guildDoc.save()
    this.logGuildChange(guild, 'prefix', prefix)
  }

  logGuildChange (guild, variable, value) {
    this.client.log(`Guild ${guild.id} has changed their ${variable} variable to ${value}`, 'Modules', 'GuildConfiguration')
  }
}
