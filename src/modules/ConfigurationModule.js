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

  get _channels () {
    return this.client.database.channels
  }

  async setPrefix (_guild, prefix) {
    await this._guilds.update(_guild, { prefix })
  }

  async setLanguage (_guild, language) {
    await this._guilds.update(_guild, { language })
  }

  async setTwitter (_guild, twitterUser, twitterChannel) {
    console.log(_guild)
    console.log(twitterUser)
    console.log(twitterChannel)
    await this._guilds.update(_guild, { twitterChannel })
    await this._channels.update(twitterChannel, { twitterUser })
  }
}
