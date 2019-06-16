const { Loader, Module, FileUtils } = require('../')

module.exports = class ModuleLoader extends Loader {
  constructor (client) {
    super(client)

    this.modules = {}
  }

  async load () {
    try {
      await this.initializeModules()
      this.client.modules = this.modules
      return true
    } catch (e) {
      this.client.logger.error(e, { label: this.constructor.name })
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
    }, e => {
      this.client.logger.error(e, { label: this.constructor.name })
    }).then(() => {
      if (!failed) {
        this.client.logger.info('All modules loaded successfully', { label: this.constructor.name })
      }
    })
  }

  /**
   * Adds a new module to the Client.
   * @param {Module} module - Module to be added
   */
  addModule (module) {
    if (!(module instanceof Module)) {
      this.client.logger.warn(`${module.name} failed to load`, { reason: 'Not a module', label: this.constructor.name })
      return false
    }

    if (module.canLoad() !== true) {
      this.client.logger.warn(`${module.name} failed to load`, { reason: module.canLoad() || 'canLoad function did not return true.', label: this.constructor.name })
      return false
    }

    try {
      this.modules[module.name] = module.load()
    } catch (e) {
      this.client.logger.warn(`${module.name} failed to load`, { reason: 'An error ocurred', label: this.constructor.name })
      this.client.logger.error(e, { label: this.constructor.name, module: module.name })
    }
    return true
  }
}
