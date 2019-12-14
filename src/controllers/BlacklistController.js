const { Controller } = require('../')

// Developer
module.exports = class DeveloperController extends Controller {
  constructor (client) {
    super({
      name: 'developer'
    }, client)
  }

  canLoad () {
    return !!this.client.database
  }

  get _users () {
    return this.client.database.users
  }

  async blacklist (_user, reason, blacklister) {
    await this._users.update(_user, { blacklisted: { reason, blacklister } })
  }

  async unblacklist (_user) {
    await this._users.update(_user, { blacklisted: null })
  }

  async blacklisted (_user, reason, blacklister) {
    const user = await this._users.findOne(_user, 'blacklisted')
    return user ? user.blacklisted : null
  }
}
