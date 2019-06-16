const { Loader } = require('../')

module.exports = class DatadogLoader extends Loader {
  constructor (client) {
    super(client)

    this.database = null
  }

  async load () {

  }
}
