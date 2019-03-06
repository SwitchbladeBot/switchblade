const { Module, Connection } = require('../')

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
    const connection = {
      name: _connection.name,
      tokens: _tokens,
      config: _connection.defaultConfig
    }
    console.log(connection)
    try {
      await this._users.update(_user, { $push: { connections: connection } })
    } catch (e) {
      console.error(e)
    }
  }

  async editConfig (_user, _connection, _config) {
    const user = await this._users.get(_user)
    const connection = user.connections.find(c => c.name === _connection)
    console.log(connection.config)
    const newConfig = Object.assign({}, connection.config, _config)
    console.log(_config)
    console.log(newConfig)
    try {
      await this._users.update(_user,
        { $set: { 'connections.$[conn].config': newConfig } },
        { arrayFilters: [{ 'conn.name': _connection }] })
      return newConfig
    } catch (e) {
      console.error(e)
    }
  }

  async getConnections (_user) {
    const { connections } = await this._users.get(_user)
    return connections
  }

  get allConnectionsDefault () {
    return Object.keys(this.client.connections).map(c => {
      return {
        name: c,
        connected: false,
        account: null,
        configuration: null
      }
    })
  }
}
