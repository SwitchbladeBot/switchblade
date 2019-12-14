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
      this.logError(e)
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
    }, this.logError.bind(this)).then(() => {
      if (failed) this.log(`${success} modules loaded, ${failed} failed.`, { color: 'yellow', tags: ['Modules'] })
      else this.log(`All ${success} modules loaded without errors.`, { color: 'green', tags: ['Modules'] })
    })
  }

  /**
   * Adds a new module to the Client.
   * @param {Module} module - Module to be added
   */
  addModule (module) {
    if (!(module instanceof Module)) {
      this.log(`${module.name} failed to load - Not an Module`, { color: 'red', tags: ['Modules'] })
      return false
    }

    this.modules[module.name] = module
    return true
  }
}
