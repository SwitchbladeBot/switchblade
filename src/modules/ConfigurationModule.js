const { Module } = require('../')

// Configuration
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
    await this._guilds.update(_guild, { prefix })
  }

  async setLanguage (_guild, language) {
    await this._guilds.update(_guild, { language })
  }

  async setDeleteUserMessage (_guild, state) {
    const guild = await this._guilds.get(_guild, 'deleteUserMessage')
    if (guild.deleteUserMessage === state) throw new Error('SAME_STATE')
    guild.deleteUserMessage = state
    await guild.save()
  }
}
