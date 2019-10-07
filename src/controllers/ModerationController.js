const { Controller } = require('../')

// Moderation
module.exports = class ModerationController extends Controller {
  constructor (client) {
    super('moderation', client)
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
