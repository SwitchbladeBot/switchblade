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
    return `${process.env.HTTP_URL}/connections/${this.name}/callback`
  }

  async callbackHandler (req) {
    const tokens = await this.callback(req)
    console.log(tokens)
    const connect = await this.client.modules.connection.connect('205873263258107905', this, tokens)
    return connect
  }
}
