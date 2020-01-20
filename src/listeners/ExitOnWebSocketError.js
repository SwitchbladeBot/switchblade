const { EventListener } = require('../')

module.exports = class ExitOnWebSocketError extends EventListener {
  constructor (client) {
    super({
      events: ['error']
    }, client)
  }

  async onError (error) {
    console.log(error)
    process.exit(1)
  }
}
