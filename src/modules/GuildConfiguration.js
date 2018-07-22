const { Module } = require('../structures')

module.exports = class GuildConfiguration extends Module {
  constructor (client) {
    super(client)
    this.name = 'guildConfig'
    this.requiresDatabase = true
  }

  async setLanguage ({ guild, doc, language }) {
    doc = doc || await this.client.database.guilds.get(guild.id)
    doc.language = language
    doc.save()
    this.logGuildChange(guild, 'language', language)
    return { ok: true, language }
  }

  async setPrefix ({ guild, doc, prefix }) {
    doc = doc || await this.client.database.guilds.get(guild.id)
    doc.prefix = prefix
    doc.save()
    this.logGuildChange(guild, 'prefix', prefix)
    return { ok: true, prefix }
  }

  logGuildChange (guild, variable, value) {
    this.log(`Guild ${guild.id} has changed their ${variable} variable to ${value}`)
  }
}
