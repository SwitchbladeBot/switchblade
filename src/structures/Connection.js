const Utils = require('../utils')

module.exports = class Connection {
  /**
   * @param {Object} opts
   * @param {string} opts.name
   * @param {Client} client
   */
  constructor (opts, client) {
    const options = Utils.createOptionHandler('Connection', opts)

    this.name = options.required('name')

    this.client = client
  }

  canLoad () {
    return !!(this.client.database && process.env.DASHBOARD_URL)
  }

  load () {
    return this
  }

  get _users () {
    return this.client.database.users
  }

  get configPattern () {
    return {}
  }

  checkConfig ([key, value]) {
    if (!this.configPattern[key]) return true
    return this.configPattern[key](value)
  }

  get authCallbackURL () {
    return `${process.env.DASHBOARD_URL}/connections/${this.name}/callback/`
  }

  async callbackHandler (req) {
    const tokens = await this.callback(req)
    const connect = await this.client.controllers.connection.connect(req.userId, this, tokens)
    return connect
  }
}
