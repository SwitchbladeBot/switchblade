const { Loader, EventListener, FileUtils } = require('../')

module.exports = class ListenerLoader extends Loader {
  constructor (client) {
    super({
      critical: true,
      preLoad: true
    }, client)

    this.listeners = []
  }

  async load () {
    try {
      await this.initializeListeners()
      this.client.listeners = this.listeners
      return true
    } catch (e) {
      this.client.logger.error(e)
    }
    return false
  }

  /**
   * Initializes all Client listeners.
   * @param {string} dirPath - Path to the listeners directory
   */
  initializeListeners (dirPath = 'src/listeners') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewListener) => {
      if (Object.getPrototypeOf(NewListener) !== EventListener) return
      this.addListener(new NewListener(this.client)) ? success++ : failed++
    }, (e) => this.client.logger.error(e)).then(() => {
      if (failed) this.client.logger.info({ tag: 'Listeners' }, `${success} listeners loaded, ${failed} failed.`)
      else this.client.logger.info({ tag: 'Listeners' }, `All ${success} listeners loaded without errors.`)
    })
  }

  /**
   * Adds a new listener to the Client.
   * @param {EventListener} listener - Listener to be added
   */
  addListener (listener) {
    if (!(listener instanceof EventListener)) {
      this.client.logger.warn({ tag: 'Listeners' }, `${listener.name} failed to load - Not an EventListener`)
      return false
    }

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
    listener.events.forEach(event => {
      this.client.on(event, listener['on' + capitalize(event)])
    })

    this.listeners.push(listener)
    return true
  }
}
