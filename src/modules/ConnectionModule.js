const { Module } = require('../')

module.exports = class ConnectionModule extends Module {
  constructor (...args) {
    super(...args)
    this.name = 'connection'
  }

  get _users () {
    return this.client.database.users
  }

  async connect (_user, _connection, _tokens) {
    if (typeof _tokens === 'string') _tokens = { token: _tokens }
    if (typeof _tokens !== 'object') throw new Error(`ConnectionModule.connect should have the last argument a string or an object, ${typeof _tokens} given`)

    console.log('a')
    //const user = await this._users.get(_user, 'connections')
    const user = await this._users.get(_user)
    console.log(user)
    if (user.connections.find(c => c.name === _connection.name)) return 'alreadyConnected'
    user.connections.push({
      name: _connection.name,
      tokens: _tokens,
      config: _connection.defaultConfig
    })
    try {
      user.save()
    } catch (e) {
      console.error(e)
    }
  }
}
