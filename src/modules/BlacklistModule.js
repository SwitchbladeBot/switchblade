const { Module } = require('../')

// Developer
module.exports = class BlacklistModule extends Module {
  constructor (client) {
    super(client)
    this.name = 'blacklist'
  }

  canLoad () {
    return !!this.client.database
  }

  get _users () {
    return this.client.database.users
  }

  async blacklist (_user, reason, blacklister) {
    this.client.logger.info(`${_user} added to the blacklist`, { label: this.constructor.name, user: { id: _user }, reason, blacklister })
    await this._users.update(_user, { blacklisted: { reason, blacklister } })
  }

  async unblacklist (_user) {
    this.client.logger.info(`${_user} removed to the blacklist`, { label: this.constructor.name, user: { id: _user } })
    await this._users.update(_user, { blacklisted: null })
  }

  async blacklisted (_user) {
    const user = await this._users.findOne(_user, 'blacklisted')
    return user ? user.blacklisted : null
  }
}
