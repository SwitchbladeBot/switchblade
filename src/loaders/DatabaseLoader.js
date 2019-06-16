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
      this.client.logger.error(e, { label: this.constructor.name })
    }
    return false
  }

  initializeDatabase (DBWrapper = MongoDB, options = {}) {
    this.database = new DBWrapper(options)
    this.database.connect()
      .then(() => this.client.logger.info('Database connection established!', { label: this.constructor.name }))
      .catch(e => {
        this.client.logger.error(e, { label: this.constructor.name })
        this.database = null
      })
  }
}
