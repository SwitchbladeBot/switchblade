const { Module } = require('../')

// Moderation
module.exports = class ModerationModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'moderation'
  }

  canLoad () {
    return !!this.client.database
  }

  get _guilds () {
    return this.client.database.guilds
  }

  async setJoinLock (_guild, state) {
    const guild = await this._guilds.get(_guild, 'joinLock')
    if (guild.joinLock === state) throw new Error('SAME_STATE')
    guild.joinLock = state
    await guild.save()
  }
}
