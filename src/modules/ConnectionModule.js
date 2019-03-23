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
    // const user = await this._users.get(_user, 'connections')
    const user = await this._users.findOne(_user, 'connections')
    console.log(user)
    if (user.connections.some(c => c.name === _connection.name)) return 'alreadyConnected'
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
    const user = await this._users.findOne(_user, 'connections')
    const connection = user.connections.find(c => c.name === _connection)
    const connectionChecker = (k, v) => this.client.connections[_connection].checkConfig(k, v)
    console.log(connectionChecker)
    let newConfig = Object.entries(_config).filter(c => (connection.config[c[0]] !== undefined && connectionChecker(c)))
    console.log(newConfig)
    let config = {}
    newConfig.forEach(c => {
      config[c[0]] = c[1]
    })
    newConfig = {
      ...connection.config,
      ...config
    }
    try {
      await this._users.update(_user,
        { $set: { 'connections.$[conn].config': newConfig } },
        { arrayFilters: [{ 'conn.name': _connection }] })
      return newConfig
    } catch (e) {
      this.client.logError(e)
    }
  }

  async disconnectUser (_user, _connection) {
    const user = await this._users.findOne(_user, 'connections')
    const connection = user.connections.find(c => c.name === _connection)
    if (!connection) {
      throw Error('Connection not found')
    }
    try {
      await this._users.update(_user, { $pull: { connections: { name: _connection } } })
      return true
    } catch (e) {
      this.client.logError(e)
      throw Error('Internal server error!')
    }
  }

  async getConnections (_user) {
    const { connections } = await this._users.findOne(_user, 'connections')
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
