module.exports = class Connection {
  constructor (client) {
    this.client = client
  }

  canLoad () {
    return !!this.client.database
  }

  load () {
    return this
  }

  get _users () {
    return this.client.database.users
  }

  get authCallbackURL () {
    return `http://localhost:8080/connections/${this.name}/callback/`
  }

  async callbackHandler (req) {
    const tokens = await this.callback(req)
    console.log(tokens)
    const connect = await this.client.modules.connection.connect(req.userId, this, tokens)
    return connect
  }
}
