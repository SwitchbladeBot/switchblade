const { Loader, APIWrapper, FileUtils } = require('../')

module.exports = class APILoader extends Loader {
  constructor (client) {
    super(client)

    this.apis = {}
  }

  async load () {
    try {
      await this.initializeAPIs()
      this.client.apis = this.apis
      return true
    } catch (e) {
      this.client.logger.error(e, { label: 'apiloader', loader: this.constructor.name })
    }
    return false
  }

  /**
   * Initializes all API Wrappers.
   * @param {string} dirPath - Path to the apis directory
   */
  initializeAPIs (dirPath = 'src/apis') {
    let success = 0
    let failed = 0
    return FileUtils.requireDirectory(dirPath, (NewAPI) => {
      if (Object.getPrototypeOf(NewAPI) !== APIWrapper) return
      this.addAPI(new NewAPI()) ? success++ : failed++
    }, e => {
      this.client.logger.error(e, { label: this.constructor.name })
    }).then(() => {
      if (!failed) {
        this.client.logger.info('All APIs loaded successfully', { label: this.constructor.name })
      }
    })
  }

  /**
   * Adds a new API Wrapper to the Client.
   * @param {APIWrapper} api - API Wrapper to be added
   */
  addAPI (api) {
    if (!(api instanceof APIWrapper)) {
      this.client.logger.warn(`${api.name} API failed to load`, { reason: 'Not an APIWrapper', label: this.constructor.name })
      return false
    }

    if (api.canLoad() !== true) {
      this.client.logger.warn(`${api.name} API failed to load`, { reason: api.canLoad() || 'canLoad function did not return true.', label: this.constructor.name })
      return false
    }

    if (!api.envVars.every(variable => {
      if (!process.env[variable]) this.client.logger.warn(`${api.name} API failed to load`, { reason: `Required environment variable "${variable}" is not set.`, label: this.constructor.name })
      return !!process.env[variable]
    })) return false

    this.apis[api.name] = api.load()
    return true
  }
}
