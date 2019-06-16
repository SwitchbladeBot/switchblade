const { EventListener } = require('../')

module.exports = class ExitOnWebSocketError extends EventListener {
  constructor (client) {
    super(client)
    this.events = ['debug']
  }

  async onDebug (string) {
    this.logger.debug(string, { label: 'Client' })
  }
}
