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
      this.client.logger.error(e, { label: this.constructor.name })
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
    }, e => {
      this.client.logger.error(e, { label: this.constructor.name })
    }).then(() => {
      if (!failed) {
        this.client.logger.info(`All connections loaded without errors.`, { label: this.constructor.name })
      }
    })
  }

  /**
   * Adds a new Connection to the Client.
   * @param {Connection} connection - Module to be added
   */
  addConnection (connection) {
    if (!(connection instanceof Connection)) {
      this.client.logger.warn(`${connection.name} failed to load`, { reason: 'Not a Connection', label: this.constructor.name })
      return false
    }

    if (connection.canLoad() !== true) {
      this.client.logger.warn(`${connection.name} failed to load`, { reason: connection.canLoad() || 'canLoad function did not return true', label: this.constructor.name })
      return false
    }

    this.connections[connection.name] = connection.load()
    return true
  }
}
