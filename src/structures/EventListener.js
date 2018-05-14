module.exports = class EventListener {
  constructor (client) {
    this.client = client
    this.events = []
  }
}
