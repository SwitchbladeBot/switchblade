const { Loader } = require('../')
const { MongoDB } = require('../database')

module.exports = class DatabaseLoader extends Loader {
  constructor (client) {
    super(client)

    this.database = null
  }

  async load () {
    try {
      await this.initializeDatabase(MongoDB, { useNewUrlParser: true })
      this.client.database = this.database
      return !!this.database
    } catch (e) {
      this.logError(e)
    }
    return false
  }

  initializeDatabase (DBWrapper = MongoDB, options = {}) {
    if (DBWrapper.envVars && !DBWrapper.envVars.every(v => {
      if (!process.env[v]) this.log(`[31mDatabase failed to load - Required environment variable "${v}" is not set.`, 'DB')
      return !!process.env[v]
    })) return false

    this.database = new DBWrapper(options)
    this.database.connect()
      .then(() => this.log('[32mDatabase connection established!', 'DB'))
      .catch(e => {
        this.logError('DB', e.message)
        this.database = null
      })
  }
}
