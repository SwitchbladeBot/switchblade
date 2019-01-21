const { EventListener } = require('../')

module.exports = class ExitOnWebSocketError extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['error']
  }

  async onError () {
    process.exit(1)
  }
}
