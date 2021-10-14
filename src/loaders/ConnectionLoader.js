const { Loader, Connection, FileUtils } = require('../')

module.exports = class ConnectionLoader extends Loader {
  constructor (client) {
    super({}, client)

    this.connections = {}
  }

  async load () {
    try {
      await this.initializeConnections()
      this.client.connections = this.connections
      return true
    } catch (e) {
      this.client.logger.error(e)
    }
    return false
  }

  /**
   * Initializes all connections.
   * @param {string} dirPath - Path to the connections directory
   */
  initializeConnections (dirPath = 'src/connections') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewConnection) => {
      if (Object.getPrototypeOf(NewConnection) !== Connection) return
      this.addConnection(new NewConnection(this.client)) ? success++ : failed++
    }, (e) => this.client.logger.error(e)).then(() => {
      if (failed) this.client.logger.info({ tag: 'Connections' }, `${success} connections loaded, ${failed} failed.`)
      else this.client.logger.info({ tag: 'Connections' }, `All ${success} connections loaded without errors.`)
    })
  }

  /**
   * Adds a new Connection to the Client.
   * @param {Connection} connection - Connection to be added
   */
  addConnection (connection) {
    if (!(connection instanceof Connection)) {
      this.client.logger.warn({ tag: 'Connections' }, `${connection.name} failed to load - Not an Connection`)
      return false
    }

    if (connection.canLoad() !== true) {
      this.client.logger.warn({ tag: 'Connections' }, `${connection.name} failed to load - ${connection.canLoad() || 'canLoad function did not return true.'}`)
      return false
    }

    this.connections[connection.name] = connection.load()
    return true
  }
}
