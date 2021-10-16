const { Loader, Module, FileUtils } = require('../')

module.exports = class ModuleLoader extends Loader {
  constructor (client) {
    super({}, client)

    this.modules = {}
  }

  async load () {
    try {
      await this.initializeModules()
      this.client.modules = this.modules
      return true
    } catch (e) {
      this.client.logger.error(e)
    }
    return false
  }

  /**
   * Initializes all modules.
   * @param {string} dirPath - Path to the modules directory
   */
  initializeModules (dirPath = 'src/modules') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewModule) => {
      if (Object.getPrototypeOf(NewModule) !== Module) return
      this.addModule(new NewModule(this.client)) ? success++ : failed++
    }, (e) => this.client.logger.error(e)).then(() => {
      if (failed) this.client.logger.info({ tag: 'Modules' }, `${success} modules loaded, ${failed} failed.`)
      else this.client.logger.info({ tag: 'Modules' }, `All ${success} modules loaded without errors.`)
    })
  }

  /**
   * Adds a new module to the Client.
   * @param {Module} module - Module to be added
   */
  addModule (module) {
    if (!(module instanceof Module)) {
      this.client.logger.warn({ tag: 'Modules' }, `${module.name} failed to load - Not an Module`)
      return false
    }

    this.modules[module.name] = module
    return true
  }
}
