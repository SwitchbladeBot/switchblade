const { Loader } = require('../')
const { MongoDB } = require('../database')

module.exports = class DatabaseLoader extends Loader {
  constructor (client) {
    super({
      preLoad: true
    }, client)

    this.database = null
  }

  async load () {
    try {
      await this.initializeDatabase(MongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
      this.client.database = this.database
      return !!this.database
    } catch (e) {
      this.client.logger.error(e)
    }
    return false
  }

  initializeDatabase (DBWrapper = MongoDB, options = {}) {
    if (DBWrapper.envVars && !DBWrapper.envVars.every(v => {
      if (!process.env[v]) this.client.logger.warn({ tag: 'DB' }, `Database failed to load - Required environment variable "${v}" is not set.`)
      return !!process.env[v]
    })) return false

    this.database = new DBWrapper(options)
    this.database.connect()
      .then(() => this.client.logger.info({ tag: 'DB' }, 'Database connection established!'))
      .catch(e => {
        this.client.logger.error('DB', e.message)
        this.database = null
      })
  }
}
