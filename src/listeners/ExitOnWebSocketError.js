const { EventListener } = require('../')

module.exports = class ExitOnWebSocketError extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['error']
  }

  async onError (error) {
    this.client.logger.error(error, { label: 'WebSocket' })
    process.exit(1)
  }
}
