const { Loader, Connection, FileUtils } = require('../')

module.exports = class ModuleLoader extends Loader {
  constructor (client) {
    super(client)

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
   * @param {string} dirPath - Path to the modules directory
   */
  initializeConnections (dirPath = 'src/connections') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewConnection) => {
      if (Object.getPrototypeOf(NewConnection) !== Connection) return
      this.addConnection(new NewConnection(this.client)) ? success++ : failed++
    }, this.logError.bind(this)).then(() => {
      this.log(failed ? `[33m${success} connections loaded, ${failed} failed.` : `[32mAll ${success} connections loaded without errors.`, 'Connections')
    })
  }

  /**
   * Adds a new Connection to the Client.
   * @param {Connection} connection - Module to be added
   */
  addConnection (connection) {
    if (!(connection instanceof Connection)) {
      this.log(`[31m${connection.name} failed to load - Not an Connection`, 'Connections')
      return false
    }

    if (connection.canLoad() !== true) {
      this.log(`[31m${connection.name} failed to load - ${connection.canLoad() || 'canLoad function did not return true.'}`, 'Connections')
      return false
    }

    this.connections[connection.name] = connection.load()
    return true
  }
}
