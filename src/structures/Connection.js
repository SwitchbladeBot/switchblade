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
    return `${process.env.HTTP_URL}/api/connections/${this.name}/callback`
  }
}
