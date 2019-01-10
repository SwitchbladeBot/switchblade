const { EventListener } = require('../')

module.exports = class MainListener extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['error']
  }

  async onError () {
    process.exit(1)
  }
}
