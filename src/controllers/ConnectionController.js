const { Controller } = require('../')

module.exports = class ConnectionController extends Controller {
  constructor (client) {
    super({
      name: 'connection'
    }, client)
  }

  get _users () {
    return this.client.database.users
  }

  async connect (_user, _connection, _tokens) {
    if (typeof _tokens === 'string') _tokens = { token: _tokens }
    if (typeof _tokens !== 'object') throw new TypeError(`ConnectionController.connect should have the last argument a string or an object, ${typeof _tokens} given`)
    const user = await this._users.findOne(_user, 'connections')
    if (user.connections.some(c => c.name === _connection.name)) return 'alreadyConnected'
    const connection = {
      name: _connection.name,
      tokens: _tokens,
      config: _connection.defaultConfig
    }
    await this._users.update(_user, { $push: { connections: connection } })
  }

  async editConfig (_user, _connection, _config) {
    const user = await this._users.findOne(_user, 'connections')
    const connection = user.connections.find(c => c.name === _connection)
    const connectionChecker = (k, v) => this.client.connections[_connection].checkConfig(k, v)
    let newConfig = Object.entries(_config).filter(c => (connection.config[c[0]] !== undefined && connectionChecker(c)))
    const config = {}
    newConfig.forEach(([key, val]) => {
      config[key] = val
    })
    newConfig = {
      ...connection.config,
      ...config
    }
    await this._users.update(_user,
      { $set: { 'connections.$[conn].config': newConfig } },
      { arrayFilters: [{ 'conn.name': _connection }] })
    return newConfig
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
      throw Error('Internal server error!')
    }
  }

  async getConnections (_user) {
    const { connections } = await this._users.findOne(_user, 'connections')
    return connections
  }

  async getConnectionsFiltered (_user) {
    const allConn = await this.allConnectionsDefault
    const connections = await this.getConnections(_user)
    const userConnections = await Promise.all(allConn.map(async conn => {
      const foundConn = connections.find(c => c.name === conn.name)
      return foundConn
        ? {
            name: foundConn.name,
            connected: true,
            account: await this.client.connections[conn.name].getAccountInfo(foundConn.tokens),
            configuration: foundConn.config
          }
        : conn
    }))
    return userConnections
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
