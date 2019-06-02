const { EventListener } = require('../')

module.exports = class ExitOnWebSocketError extends EventListener {
  constructor (client) {
    super(client, {
      events: ['error']
    })
  }

  async onError (error) {
    console.log(error)
    process.exit(1)
  }
}
