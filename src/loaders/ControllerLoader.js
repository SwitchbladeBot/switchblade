const { Loader, Controller, FileUtils } = require('../')

module.exports = class ControllerLoader extends Loader {
  constructor (client) {
    super({}, client)

    this.controllers = {}
  }

  async load () {
    try {
      await this.initializeControllers()
      this.client.controllers = this.controllers
      return true
    } catch (e) {
      this.client.logger.error(e)
    }
    return false
  }

  /**
   * Initializes all controllers.
   * @param {string} dirPath - Path to the controllers directory
   */
  initializeControllers (dirPath = 'src/controllers') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewController) => {
      if (Object.getPrototypeOf(NewController) !== Controller) return
      this.addController(new NewController(this.client)) ? success++ : failed++
    }, (e) => this.client.logger.error(e)).then(() => {
      if (failed) this.client.logger.info({ tag: 'Controllers' }, `${success} controllers loaded, ${failed} failed.`)
      else this.client.logger.info({ tag: 'Controllers' }, `All ${success} controllers loaded without errors.`)
    })
  }

  /**
   * Adds a new controller to the Client.
   * @param {Controller} controller - Controller to be added
   */
  addController (controller) {
    if (!(controller instanceof Controller)) {
      this.client.logger.warn({ tag: 'Controllers' }, `${controller.name} failed to load - Not an Controller`)
      return false
    }

    if (controller.canLoad() !== true) {
      this.client.logger.warn({ tag: 'Controllers' }, `${controller.name} failed to load - ${controller.canLoad() || 'canLoad function did not return true.'}`)
      return false
    }

    this.controllers[controller.name] = controller.load()
    return true
  }
}
