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
      this.logError(e)
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
    }, this.logError.bind(this)).then(() => {
      if (failed) this.log(`${success} connections loaded, ${failed} failed.`, { color: 'yellow', tags: ['Connections'] })
      else this.log(`All ${success} connections loaded without errors.`, { color: 'green', tags: ['Connections'] })
    })
  }

  /**
   * Adds a new Connection to the Client.
   * @param {Connection} connection - Connection to be added
   */
  addConnection (connection) {
    if (!(connection instanceof Connection)) {
      this.log(`${connection.name} failed to load - Not an Connection`, { color: 'red', tags: ['Connections'] })
      return false
    }

    if (connection.canLoad() !== true) {
      this.log(`${connection.name} failed to load - ${connection.canLoad() || 'canLoad function did not return true.'}`, { color: 'red', tags: ['Connections'] })
      return false
    }

    this.connections[connection.name] = connection.load()
    return true
  }
}
