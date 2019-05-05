module.exports = class Connection {
  constructor (client) {
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
    const connect = await this.client.modules.connection.connect(req.userId, this, tokens)
    return connect
  }
}
