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
      this.logError(e)
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
    }, this.logError.bind(this)).then(() => {
      if (failed) this.log(`${success} controllers loaded, ${failed} failed.`, { color: 'yellow', tags: ['Controllers'] })
      else this.log(`All ${success} controllers loaded without errors.`, { color: 'green', tags: ['Controllers'] })
    })
  }

  /**
   * Adds a new controller to the Client.
   * @param {Controller} controller - Controller to be added
   */
  addController (controller) {
    if (!(controller instanceof Controller)) {
      this.log(`${controller.name} failed to load - Not an Controller`, { color: 'red', tags: ['Controllers'] })
      return false
    }

    if (controller.canLoad() !== true) {
      this.log(`${controller.name} failed to load - ${controller.canLoad() || 'canLoad function did not return true.'}`, { color: 'red', tags: ['Controllers'] })
      return false
    }

    this.controllers[controller.name] = controller.load()
    return true
  }
}
