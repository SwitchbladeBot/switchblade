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
    const guild = await this._guilds.findOne(_guild, 'joinLock')
    if (guild.joinLock === state) throw new Error('SAME_STATE')
    await this._guilds.update(_guild, { joinLock: state })
  }
}
