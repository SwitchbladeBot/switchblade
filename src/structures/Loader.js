module.exports = class Loader {
  constructor (client) {
    this.client = client
    this.critical = false
  }

  load (client) {
    return true
  }
}
