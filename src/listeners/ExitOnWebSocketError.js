const { EventListener } = require('../')

module.exports = class ExitOnWebSocketError extends EventListener {
  constructor (client) {
    super({
      events: ['error']
    }, client)
  }

  async onError (error) {
    this.client.logger.fatal(error)
    process.exit(1)
  }
}
