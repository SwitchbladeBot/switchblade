const { Module } = require('../')

// Economy
module.exports = class ConfigurationModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'configuration'
  }

  canLoad () {
    return !!this.client.database
  }

  get _guilds () {
    return this.client.database.guilds
  }

  async setPrefix (_guild, prefix) {
    const guild = await this._guilds.get(_guild)
    guild.prefix = prefix
    await guild.save()
  }

  async setLanguage (_guild, language) {
    const guild = await this._guilds.get(_guild)
    guild.language = language
    await guild.save()
  }
}
