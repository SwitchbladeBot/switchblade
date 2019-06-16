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
      return true
    } catch (e) {
      this.logError(e)
    }
    return false
  }

  initializeDatabase (DBWrapper = MongoDB, options = {}) {
    this.database = new DBWrapper(options)
    this.database.connect()
      .then(() => this.log('[32mDatabase connection established!', 'DB'))
      .catch(e => {
        this.logError('DB', e.message)
        this.database = null
      })
  }
}
